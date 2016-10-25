var express = require('express');
var router = express.Router();
var zipcodes = require('zipcodes');

router.get('/api/findLocations', function(req, responseAPI, next) {
  var lookup = req.query.geo;
  var city = zipcodes.lookup(lookup);
  if (city)
    return responseAPI.status(200).send(city)
  else {
    return responseAPI.status(400).send()
  }
})

router.get('/api/getweather', function(req, responseAPI, next) {
  var geo = req.query.geo;
  var postal = req.query.postal;

  function fetchWeather () {
    var WeatherUnlocked_APP_ID = config.WeatherUnlocked_APP_ID;
    var WeatherUnlocked_APP_KEY = config.WeatherUnlocked_APP_KEY;
    var weatherURL;
    if (postal) {
      var searchQuery = 'us.' + postal;
      weatherURL = "http://api.weatherunlocked.com/api/current/"+searchQuery+"?app_id="+WeatherUnlocked_APP_ID+"&app_key="+WeatherUnlocked_APP_KEY;
    }
    else {
      weatherURL = "http://api.weatherunlocked.com/api/current/"+geo+"?app_id="+WeatherUnlocked_APP_ID+"&app_key="+WeatherUnlocked_APP_KEY;
    }

    request(weatherURL, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var newPostKey = firebase.database().ref().child('weather').push().key;
        var updates = {};
        var newBody = JSON.parse(body);
        newBody.timestamp = new Date();
        updates['/weather/' + postal+ "/"+ newPostKey] =newBody
        firebase.database().ref().update(updates);

        // TODO Add weather to DB
        responseAPI.status(200).send(body);
      }
      else {
        responseAPI.status(400).send({});
      }
    });
  }

  if (geo && geo.trim()) {
    // Check if weather exists in DB
    firebase.database().ref('/weather/' + postal + '/').orderByChild('timestamp').limitToLast(1).once('child_added').then(function(snapshot) {
      var data = snapshot.val();
      if (data) {
        var TEN_MINUTES = 10 * 60 * 1000;
        var comparedDate = new Date();

        // If Most Recent Entry is less than 10 minutes old use it
        if ((comparedDate - new Date(data.timestamp)) < TEN_MINUTES) {
          return responseAPI.status(200).send(data);
        }
        else {
          fetchWeather();
        }
      }
      else {
        fetchWeather();
      }
    });
  }
  else {
    responseAPI.status(400).send({});
  }

});

var getlocation = module.exports.getlocation = function(req, responseAPI) {
  var url='https://maps.googleapis.com/maps/api/geocode/json';
  var key = config.MAPS_API;
  var address = '';
  var postal_code = '';
  var getBody = {};
  getBody.key = key;
  getBody.address = '';

}

module.exports = router;
