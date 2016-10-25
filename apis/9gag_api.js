var gag = require('node-9gag');
var request = require('request');

var express = require('express');
var router = express.Router();
var Q = require('q');

var find9Gag = function(searchTerm) {
  var deferred = Q.defer();
  gag.find( (searchTerm ||'cats'), function ( err, res9Gag ) {
    if (err) {
      deferred.reject({});
    }
    else {
      deferred.resolve(res9Gag);
    }
  });
  return deferred.promise;
}

var section9Gag = function (section) {
  var deferred = Q.defer();
  var posts = [];
  var searchTerm = section || 'funny';
  gag.section(searchTerm, 'hot', function ( err, resHot ) {
    if (resHot)
      posts = posts.concat(resHot)
    gag.section(searchTerm, 'fresh', function ( err, resFresh ) {
      if (err) {
        deferred.reject({});
      }
      else {
        if (resFresh)
          posts = posts.concat(resFresh)
        deferred.resolve(posts);
      }
    });
  });
  return deferred.promise;
}

var getSubreddit = function (searchTerm) {
  var deferred = Q.defer();
  var subReddit = searchTerm || 'cats';
  var redditLink = 'https://www.reddit.com/r/' + subReddit + '/new.json?sort=new';

  request(redditLink, function (error, response, body) {
    if (error) {
      deferred.reject({});
    }
    else {
      deferred.resolve(body);
    }

  })
  return deferred.promise;
}

router.get('/get9Gag', function(req, res, next) {
  var allPosts = [];
  find9Gag()
  .then(function(posts) {
    if (posts)
      allPosts = allPosts.concat(posts.result)
    return section9Gag();
  })
  .then(function(sectionPosts) {
    if (sectionPosts)
      allPosts = allPosts.concat(sectionPosts)
    return res.status(200).send(allPosts);
  })
  .catch(function(err) {
    console.log(err)
    return res.status(400).send();
  })
});

router.get('/getReddit', function(req, res, next) {
  var allPosts = [];
  getSubreddit()
  .then(function(sectionPosts) {
    return res.status(200).send(sectionPosts);
  })
  .catch(function(err) {
    return res.status(400).send();
  })
});

module.exports = router;
