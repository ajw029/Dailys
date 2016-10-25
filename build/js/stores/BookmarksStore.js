var AppDispatcher = require('../dispatcher/AppDispatcher');

var Storage = require('../libs/storage');

var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var merge = require('merge');

var myPackages = [];
var myWeather = {};
var myTodos = [];

function loadPackages(data) {
  myPackages = data;
  BookmarksStore.emitChange();
}

function loadWeather(responseText) {

  myWeather = responseText;
  BookmarksStore.emitChange();
}

function loadTodos(data) {
  myTodos = data;
  BookmarksStore.emitChange();
}

var BookmarksStore = merge(EventEmitter.prototype, {

  // Packages
  loadPackages: function() {
    return myPackages;
  },

  loadWeather: function() {
    return myWeather;
  },

  loadTodos: function() {
    return myTodos;
  },

  emitChange: function() {
    this.emit('change');
  },

  addChangeListener: function(callback) {
    this.on('change', callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener('change', callback);
  }

});

AppDispatcher.register(function(payload) {
  var action = payload.action;
  // Define what to do for certain actions
  switch(action.actionType) {

    case Constants.LOAD_TODOS:
      if (!Storage.get("bookmark_todoStorage")) {
        var todoArray = [];
        loadTodos(todoArray);
      }
      else {
        var todoArray = Storage.get("bookmark_todoStorage");
        loadTodos(todoArray);
      }
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          firebase.database().ref('/user-todos/' + user.uid + '/').once('value').then(function(snapshot) {
            var data = snapshot.val();
            var keys = Object.keys(data);
            var myTodos = [];
            var objToday = new Date();
            var day = objToday.getDay();
            for (var i = 0; i < keys.length; i++) {
              var todo = data[keys[i]];
              var lastTransaction = new Date(todo.lastTransaction);

              if (todo.isRepeating == true && todo.week[day] == 1 && todo.deleted == false) {
                if (objToday.getDate() != lastTransaction.getDate() ||
                    objToday.getFullYear() != lastTransaction.getFullYear() ||
                    objToday.getMonth() != lastTransaction.getMonth()
                   ) {
                     todo.lastTransaction = new Date();
                     todo.isComplete = false;
                     console.log(todo);
                     var updates = {};
                     updates['/user-todos/' + user.uid + '/' + todo.id + '/'] = todo;
                     firebase.database().ref().update(updates);
                }
                myTodos.push(todo);
              }
              else if (todo.isRepeating === false  && todo.deleted == false){
                myTodos.push(todo);
              }
            }

            Storage.set("bookmark_todoStorage", myTodos);
            loadTodos(myTodos);
          });
        }
      });

      break;
    case Constants.ADD_TODO:
      var todo = payload.action.data;
      var newPostKey = firebase.database().ref().child('todos').push().key;

      var todoArray = Storage.get("bookmark_todoStorage");
      todo.id = newPostKey;
      todoArray.push(todo);

      // Local Save the Data
      Storage.set("bookmark_todoStorage", todoArray);
      loadTodos(todoArray);

      var user = firebase.auth().currentUser;
      var uid = user.uid;
      var updates = {};
      //updates['/todos/' + newPostKey] = todo;
      updates['/user-todos/' + uid + '/' + newPostKey] = todo;

      firebase.database().ref().update(updates);
      break;
    case Constants.DELETE_TODO:
      var todo_id = payload.action.data;
      var todos = BookmarksStore.loadTodos();
      for (var i = 0; i < todos.length;i++) {
        if (todos[i].id == todo_id) {
          todos.splice(i, 1);
          break;
        }
      }
      Storage.set("bookmark_todoStorage", todos);
      loadTodos(todos);

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          firebase.database().ref('/user-todos/' + user.uid + '/').once('value').then(function(snapshot) {
            var data = snapshot.val();
            var keys = Object.keys(data);
            var todo = data[todo_id];
            console.log(data)
            todo.deleted = true;
            console.log(todo)
            var updates = {};
            updates['/user-todos/' + user.uid + '/' + todo_id + '/'] = todo;
            firebase.database().ref().update(updates);
          });
        }
      });

      break;
    case Constants.EDIT_TODO:
      var todo_ = payload.action.data;
      var todos = BookmarksStore.loadTodos();
      for (var i = 0; i < todos.length;i++) {
        if (todos[i].id == todo_.id) {
          todos[i].week = todo_.week;
          todos[i].title = todo_.title;
          break;
        }
      }
      Storage.set("bookmark_todoStorage", todos);
      loadTodos(todos);
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          firebase.database().ref('/user-todos/' + user.uid + '/').once('value').then(function(snapshot) {
            var data = snapshot.val();
            var keys = Object.keys(data);
            var todo = data[todo_.id];
            todo.week = todo_.week;
            todo.title = todo_.title;
            console.log(todo);

            var updates = {};
            updates['/user-todos/' + user.uid + '/' + todo_.id + '/'] = todo;
            firebase.database().ref().update(updates);
          });
        }
      });

      break;
    case Constants.CHECK_TODO:
      var todo_id = payload.action.data;
      var todos = BookmarksStore.loadTodos();
      for (var i = 0; i < todos.length; i++) {
        if (todos[i].id === todo_id) {
          todos[i].isComplete = !todos[i].isComplete;
        }
      }
      Storage.set("bookmark_todoStorage", todos);

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          firebase.database().ref('/user-todos/' + user.uid + '/').once('value').then(function(snapshot) {
            var data = snapshot.val();
            var keys = Object.keys(data);
            var todo = data[todo_id];
            todo.lastTransaction = new Date();
            todo.isComplete = !todo.isComplete;

            var updates = {};
            updates['/user-todos/' + user.uid + '/' + todo_id + '/'] = todo;
            firebase.database().ref().update(updates);
          });
        }
      });

      break;
    case Constants.LOAD_PACKAGES:
      if (!Storage.get("bookmark_packageStorage")) {
        var todoArray = [];
        Storage.set("bookmark_packageStorage", todoArray);
        loadPackages(todoArray);
      }
      else {
        var todoArray = Storage.get("bookmark_packageStorage");
        loadPackages(todoArray);
      }

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          firebase.database().ref('/user-packages/' + user.uid + '/').once('value').then(function(snapshot) {
            var data = snapshot.val();
            var keys = Object.keys(data);
            var myPackages = [];
            for (var i = 0; i < keys.length; i++) {
              if (data[keys[i]].deleted === false) {
                var package_ = data[keys[i]];
                package_.id = keys[i];
                myPackages.push(package_);
              }
            }
            Storage.set("bookmark_packageStorage", myPackages);
            loadPackages(myPackages);
          });
        }
      });

      break;
    case Constants.ADD_PACKAGE:
      var my_package = payload.action.data;
      var newPostKey = firebase.database().ref().child('todos').push().key;
      var user = firebase.auth().currentUser;
      var uid = user.uid;

      var updates = {};
      //updates['/packages/' + newPostKey] = my_package;
      updates['/user-packages/' + uid + '/' + newPostKey] = my_package;

      if (!Storage.get("bookmark_packageStorage")) {
        var tempArray = [];
        var todoStorage = Storage.set("bookmark_packageStorage", tempArray);
      }
      var tmpArray = Storage.get("bookmark_packageStorage");
      my_package.id = newPostKey;
      tmpArray.push(my_package);
      Storage.set("bookmark_packageStorage", tmpArray);
      loadPackages(tmpArray);

      firebase.database().ref().update(updates);

      break;

    case Constants.DELETE_PACKAGE:
      var package_ = payload.action.data;
      var b_id = package_.id;
      // Locally filter out package to delete
      function checkPackage(package_) {
        return b_id !== package_.id;
      };

      var myPackages = BookmarksStore.loadPackages();
      myPackages = myPackages.filter(checkPackage);
      Storage.set("bookmark_packageStorage", (myPackages));
      loadPackages(myPackages);

      // Post Data
      var user = firebase.auth().currentUser;
      var newPostKey = firebase.database().ref().child('todos').push().key;
      var uid = user.uid;

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          firebase.database().ref('/user-packages/' + user.uid + '/').once('value').then(function(snapshot) {
            var data = snapshot.val();
            data[b_id].deleted=true;

            var uid = user.uid;
            var updates = {};
            updates['/user-packages/' + uid + '/'] = data;
            firebase.database().ref().update(updates);
          });
        }
      });

      break;

    case Constants.EDIT_PACKAGE:
      // Update Data locally
      var updated_package = payload.action.data;
      var b_id = updated_package.id;

      function checkPackage(package_) {
        if (b_id !== package_.id) {
          return package_;
        }
        else {
          return updated_package;
        }
      };
      var myPackages = BookmarksStore.loadPackages();
      myPackages = myPackages.map(checkPackage);
      Storage.set("bookmark_packageStorage", (myPackages));
      loadPackages(myPackages);

      // Post Data
      var user = firebase.auth().currentUser;
      var newPostKey = firebase.database().ref().child('todos').push().key;
      var uid = user.uid;

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          firebase.database().ref('/user-packages/' + user.uid + '/').once('value').then(function(snapshot) {
            var data = snapshot.val();
            data[b_id].title = updated_package.title;
            data[b_id].orderNum = updated_package.orderNum;
            data[b_id].service = updated_package.service;

            var uid = user.uid;
            var updates = {};
            updates['/user-packages/' + uid + '/'] = data;
            firebase.database().ref().update(updates);
          });
        }
      });
      break;

    case Constants.LOAD_WEATHER:

      function setUpWeather(getBody) {
        var expired_time = 1*60*1000; // 1 minute
        var cached_weather = Storage.get( "bookmark_weather" );
        if (cached_weather) {
          cached_weather.city = getBody.city;
          loadWeather(cached_weather);
        }

        if ( !cached_weather || (new Date(cached_weather.timestamp).getTime()+  expired_time ) < new Date().getTime() ) {
          $.ajax({
              url: '/api/getweather',
              type: 'GET',
              data: getBody,
              success: function (parsedResponse, statusText, jqXhr) {
                  var responseText = JSON.parse(jqXhr.responseText);
                  responseText.timestamp = new Date();
                  responseText.city = getBody.city;
                  responseText.postal = getBody.postal;
                  Storage.set("bookmark_weather", (responseText));
                  console.log('Weather: \n'+ JSON.stringify(responseText))
                  loadWeather(responseText);

                  var newPostKey = firebase.database().ref().child('todos').push().key;

                  // Write the new post's data simultaneously in the posts list and the user's post list.
                  if (responseText.postal) {
                    var updates = {};
                    updates['/weather/' + responseText.postal+ "/"+ newPostKey] = responseText;
                    firebase.database().ref().update(updates);

                  }
                },
              error: function (error) {
                  var status_code = error.status;
                  var status_text = error.statusText;
                  var data = jQuery.parseJSON(error.responseText);
                  var error_message = data.Message;
                  var error_description = data.Description;
                  var error_internal_code = data.InternalCode;
                  var error_url = data.HelpUrl;
              }
          });
        }
      }

      var expired_time = 1*60*1000; // 1 minute

      // Sets Up Location
      $.ajax({
          url: "http://ipinfo.io",
          jsonp: "callback",
          dataType: "jsonp",
          success: function( response ) {
            var geo = response.loc;

            var getBody = {};
            getBody.geo = geo;
            getBody.postal = response.postal;
            getBody.city = response.city;
            Storage.set('b_geo', (getBody));
            setUpWeather(getBody);
          },
          error: function (jqXHR, textStatus, errorThrown ) {
            console.log(jqXHR)
          }
      });

      break;
    default:
      return true;
  }

  // If action was acted upon, emit change event
  BookmarksStore.emitChange();

  return true;

});


module.exports = BookmarksStore;
