// Global Resources
config = require('./configs/my_configs');
request = require('request');
jsdom = require('jsdom');

// APIS
var packageapi = require('./apis/packageapi');
var weatherapi = require('./apis/weatherapi');

// Node Modules
var express = require('express'),
url = require('url'),
router = express.Router();

fs = require('fs');
path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var compression = require('compression');
var minify = require('express-minify');
var session = require('express-session');
var minifyHTML = require('express-minify-html');

firebase = require("firebase");
firebase.initializeApp({
  serviceAccount: "./serviceAccountCreds.json",
  databaseURL: "https://bookmarx-bdfc0.firebaseio.com"
});

// Google API
var readline = require('readline');
google = require('googleapis');
googleAuth = require('google-auth-library')

var mySession = session({
  secret: config.SESSION_KEY,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
});

var app = express();
// Set up session
app.use(mySession);

/*  Not overwriting default views directory of 'views' */
app.set('view engine', 'ejs');
app.set('view cache', true);
app.set('x-powered-by', false);
app.use(compression());

app.use(minify({cache: './cache'}));
app.use(minifyHTML({
    override:      true,
    htmlMinifier: {
        removeComments:            true,
        collapseWhitespace:        true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes:     true,
        removeEmptyAttributes:     true,
        minifyJS:                  true
    }
}));

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//app.use(express.static('./public', { maxAge: 86400000 })); // One day caching
app.use(express.static('./public', { maxAge:  0}));
app.use(bodyParser.urlencoded({ extended: true }));

// Set up logging files (accessLog for suspicious requests, errorLog for errors)
var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});
var errorLogStream = fs.createWriteStream(__dirname + '/error.log', {flags: 'a'});

// Set up logging to detect only "suspicious" requests (any requests we haven't defined)
app.use(morgan('{"remote_addr": ":remote-addr", "remote_user": ":remote-user", "date": ":date[clf]", "method": ":method", "url": ":url", "http_version": ":http-version", "status": ":status", "result_length": ":res[content-length]", "referrer": ":referrer", "user_agent": ":user-agent", "response_time": ":response-time"}',
{ skip: function(req, res) { return (req.method === 'GET' || req.method === 'POST'); },
	stream: accessLogStream }
));

// Set up error logging
app.use(morgan('{"remote_addr": ":remote-addr", "remote_user": ":remote-user", "date": ":date[clf]", "method": ":method", "url": ":url", "http_version": ":http-version", "status": ":status", "result_length": ":res[content-length]", "referrer": ":referrer", "user_agent": ":user-agent", "response_time": ":response-time"}',
{ skip: function(req,res) { return res.statusCode < 400; },
  stream: errorLogStream }
));

app.use(express.static(__dirname + '/views'));

// Sign up & Login Routes
app.use(require('./routes/routes'));

// Packages API Routes
app.use(require('./apis/packageapi'));

// Weather API Routes
app.use(require('./apis/weatherapi'));

// 9Gag APIs
app.use(require('./apis/9gag_api'));

app.listen(config.PORT || 8080 , function () {
  console.log('Server listening on port ' + config.PORT || 8080 + '!');
});
