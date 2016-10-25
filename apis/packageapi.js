var packages_table = 'packages';

var express = require('express');
var router = express.Router();
var CronJob = require('cron').CronJob;

var Q = require('q');
function scrape(service, orderNum) {
  var deferred = Q.defer();
  if (service && service.toLowerCase()=="usps" && orderNum) {
    request({uri: 'https://tools.usps.com/go/TrackConfirmAction.action?tRef=fullpage&tLc=1&text28777=&tLabels='+orderNum}, function(err, response, body){
      var self = this;
      self.items = new Array();
      if(err && response.statusCode !== 200){console.log('Request error.');}
      jsdom.env({
        html: body,
        scripts: ['http://code.jquery.com/jquery-1.6.min.js'],
        done: function(err, window){
          function trim1 (str) {
              return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
          }
          var $ = window.jQuery;
          var date = $('.tracking #results-content #tracking-results ul:eq(0) li:eq(1) span:eq(1)').text().trim();
          if (!date.trim()) {
            date = $('.tracking .tracking-result .tracking-summary .tracking-progress li span:eq(1)').text().trim();
          }

          var status =  $('.status:eq(1)').text().trim();
          var location = $('.location:eq(1)').text().trim();

          var packageTracker = {};
          packageTracker.expectedDate = date;
          packageTracker.status = status;
          packageTracker.location = location;
          deferred.resolve(packageTracker);
        }
      });
    });
  }
  else if (service && service.toLowerCase()=="ups" && orderNum) {
    var UPS_URL = 'https://wwwapps.ups.com/WebTracking/track?loc=en_US&tbifl=1&hiddenText=&track.x=Track&tracknum='+orderNum;
    request({uri: UPS_URL}, function(err, response, body){
      var self = this;
      self.items = new Array();
      if(err || response.statusCode !== 200){console.log('Request error.');}
      jsdom.env({
        html: body,
        scripts: ['http://code.jquery.com/jquery-1.6.min.js'],
        done: function(err, window){
          function cleanify (str) {
            if (str) {
              str = str.toString().replace(/(\r\n|\n|\r)/gm,"");
              str = str.toString().replace(/\t/g,'');
              str = str.toString().replace(/\s+/g, " ");
              return str.toString().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            }
            else
              return ''
          }
          var $ = window.jQuery;

          var date =$('fieldset div .marginBegin:eq(1) dl:eq(0) dd').text().trim();

          var progressList = [];

          var tableRows =$('table.dataTable tbody tr').each(function() {
            var statusObj = {
              location: '',
              date: '',
              activity:''
            }
            var location = $(this).find('td:eq(0)').text().trim();
            var date = $(this).find('td:eq(1)').text().trim();
            var activity = $(this).find('td:eq(3)').text().trim();
            statusObj.location = cleanify(location);
            statusObj.date = cleanify(date);
            statusObj.activity =cleanify( activity);
            progressList.push(statusObj);
          });
          progressList = progressList.slice(1);


          var status =  cleanify($('.pkgstep span a:eq(0)').text().trim());
          var location = '';
          if (progressList.length > 0) {
            location = progressList[0].location.trim();
          }

          var packageTracker = {};

          // Sanitize Date
          date = date.replace(/\s+/g, ' ');

          packageTracker.activities = progressList;
          packageTracker.expectedDate = date;
          packageTracker.status = status.trim();
          packageTracker.location = location.trim();
          deferred.resolve(packageTracker);
        }
      });
    });
  }
  // TODO
  else if (service && service.toLowerCase()=="fedex" && orderNum) {
    request({uri: 'https://www.fedex.com/apps/fedextrack/?tracknumbers='+orderNum}, function(err, response, body){
      var self = this;
      self.items = new Array();
      if(err && response.statusCode !== 200){console.log('Request error.');}
      jsdom.env({
        html: body,
        scripts: ['http://code.jquery.com/jquery-1.6.min.js'],
        done: function(err, window){
          function trim1 (str) {
              return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
          }
          var $ = window.jQuery;
          //console.log(window)
          /*
          var date = $('.tracking #results-content #tracking-results ul:eq(0) li:eq(1) span:eq(1)').text().trim();
          if (!date.trim()) {
            date = $('.tracking .tracking-result .tracking-summary .tracking-progress li span:eq(1)').text().trim();
          }

          var status =  $('.status:eq(1)').text().trim();
          var location = $('.location:eq(1)').text().trim();
          */
          var packageTracker = {};
          // packageTracker.expectedDate = date;
          // packageTracker.status = status;
          // packageTracker.location = location;
          return packageTracker;
        }
      });
    });
  }
  return deferred.promise;
}

var job = new CronJob({
  cronTime: '*/10 * * * * *',
  onTick: function() {
    firebase.database().ref("/user-packages/")
    .once('value')
    .then(function(snapshot) {
      var data = snapshot.val();
      var keys = Object.keys(data);
      var toProcess = [];

      var TEN_MINUTES = 10 * 60 * 1000;
      var expiredTime = (30 * 24 * 60 * 60 * 1000);
      var comparedDate = new Date();

      for (var i = 0; i < keys.length; i++) {
        var userData = data[keys[i]];
        var packageKeys = Object.keys(userData);
        for (var j = 0; j < packageKeys.length; j++) {
          var userPackage = userData[packageKeys[j]];
          if ((comparedDate - new Date(userPackage.timestamp) < expiredTime ) &&
              (userPackage.updateTime && comparedDate - new Date(userPackage.updateTime) > TEN_MINUTES) &&
             (userPackage.deleted === false || userPackage.received === false || userPackage.status !== 'Delivered') ) {
            userPackage.user_key = keys[i];
            userPackage.key = packageKeys[j];
            toProcess.push(userPackage);
          }
        }
      }

      for (var i = 0; i < toProcess.length; i++) {
        var processItem = toProcess[i];
        function process(processItem) {
          scrape(processItem.service, processItem.orderNum)
          .then(function(packageStatus) {
            if (packageStatus.expectedDate) {
              processItem.date = packageStatus.expectedDate;
            }
            if (packageStatus.status) {
              processItem.status = packageStatus.status;
            }
            if (packageStatus.location) {
              processItem.location = packageStatus.location;
            }
            processItem.activities = packageStatus.activities;
            var userID = processItem.user_key;
            var b_id = processItem.key;
            delete processItem.user_key;
            delete processItem.key;

            firebase.database().ref('/user-packages/' + userID + '/').once('value').then(function(snapshot) {
              var data = snapshot.val();
              processItem.updateTime = new Date();
              data[b_id] = processItem;

              var uid = userID;
              var updates = {};
              updates['/user-packages/' + uid + '/'] = data;
              firebase.database().ref().update(updates);
            });
          })
        };
        process(processItem)

      }

    });

  },
  start: true,
  timeZone: 'America/Los_Angeles'
});
job.start();

router.get('/api/trackpackage', function(req, responseAPI, next) {
  var service = req.query.service;
  var orderNum = req.query.orderNum;
  // Scraper for USPS
  scrap(service, orderNum);

  // else {
  //   return responseAPI.status(400).send({});
  // }
});

module.exports = router;
