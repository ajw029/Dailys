var fDeg;
var cDeg;

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function changeToCelsius() {
  $('.weatherOption').find('.temp_fah').removeClass('active');
  $('.weatherOption').find('.temp_cel').addClass('active');
  $("#weather_degrees").text(parseInt(cDeg))
}

function changeToFah() {
  $('.weatherOption').find('.temp_fah').addClass('active');
  $('.weatherOption').find('.temp_cel').removeClass('active');
  $("#weather_degrees").text(parseInt(fDeg))
}

function toggleWeather(e) {
  var parentNode = e.parentNode.parentNode;
  if ($(parentNode).find('.weathercontainer-more').hasClass('hide')) {
      $(parentNode).find('.weathercontainer-more').removeClass('hide');
      $(parentNode).find('.card__action-bar').find('.card__button').text("LESS");
  }
  else {
    $(parentNode).find('.weathercontainer-more').addClass('hide');
    $(parentNode).find('.card__action-bar').find('.card__button').text("MORE");
  }
}

/* MyTodos */
function showTodayTodoList() {

    $('#todo_today_tab_container').removeClass('hide')
}

function showUpcomingTodoList() {
    $('#todo_today_tab_container').addClass('hide')
}

function isRepeatingTodo(myTodo) {
  // Check if the todo is repeating
  var repeatSchedule = myTodo.repeat;
  var isRepeating = false;
  if (repeatSchedule) {
    for (var j = 0; j < repeatSchedule.length; j++) {
      if (repeatSchedule[j] == true) {
        isRepeating = true;
        break;
      }
    }
  }

  return isRepeating;
}
function isSameDay(day1, day2) {
  return new Date(day1).setHours(0,0,0,0) === new Date(day2).setHours(0,0,0,0);
}

/*
 * Todo
 */

function checkOffTodo(e) {
  var todoID = $(e).parent().parent().data('todoid');

  if (!localStorage.getItem("bookmark_todoStorage")) {
    var tempArray = [];
    localStorage.setItem("bookmark_todoStorage", JSON.stringify(tempArray));
  }
  var todoArray = JSON.parse(localStorage.getItem("bookmark_todoStorage"));
  var i = 0;
  var objToday = new Date();

  // Finds the todo item in the local storage
  for (; i < todoArray.length; i++) {
    if (todoArray[i].uuid == todoID) {
      var myTodo = todoArray[i];

      // If not a repeating todo, remove
      if (!isRepeatingTodo(myTodo) && i > -1) {
        //todoArray.splice(i, 1);
        //localStorage.setItem("bookmark_todoStorage", JSON.stringify(todoArray));
      }
      // If repeating todo, set as marked
      else {
        if (!localStorage.getItem("bookmark_todoHistory")) {
          var history = [];
          localStorage.setItem('bookmark_todoHistory', JSON.stringify(history));
        }

        var history = JSON.parse(localStorage.getItem("bookmark_todoHistory"));
        var entryExists = false;
        for (var i = 0; i < history.length; i++) {
          // If History less than today clear out old entries
          if (history[i].date < objToday.setHours(0,0,0,0)) {
            history.splice(i, 1);
            continue;
          }

          // Entries for today exist
          if (isSameDay(history[i].date,objToday)) {
            entryExists = true;
            if (history[i].checkedOff.indexOf(todoID) == -1) {
              history[i].checkedOff.push(todoID);
            }
            break;
          }
        }
        if (!entryExists) {
          var checkedOff = [];
          checkedOff.push(todoID);
          var todayHistory = {};
          todayHistory.date = objToday.setHours(0,0,0,0);
          todayHistory.checkedOff = checkedOff;
          history.push(todayHistory);
        }

        localStorage.setItem('bookmark_todoHistory', JSON.stringify(history));
      }
      break;
    }
  }

  // Delete the todo from the list  TODO

}

function closeViewTodo(e) {
    $("#todo_viewingMyTodoContainer").addClass('hide');
}

function getMoreTodoInfo(e) {
  $("#todo_viewingMyTodoContainer").removeClass('hide');
  var title = $(e).parent().find('.label--checkbox').find('span').text();

  $("#todo_view_Title").text(title);

}

function closeAddTodo(e) {
  var container = $('#todo_todoListAddEditContainer');
  container.addClass('hide')
  var originalHeight = container.parent().height();
  container.parent().height((originalHeight-50)+"px");
  $('#todo_hidden_id').text('')
  $('#todo_title').val('');
  $('#todo_descr').val('');
  $('#todo_repeat_days').find('label').find('input').each(function(){
    $(this).prop( "checked", false );
  })
  $('#todo_everydaySelector').prop( "checked", false );
}

function addNewTodo(e) {
  var container = $('#todo_todoListAddEditContainer');
  container.find("#todo_addEdit_Title").text("Add A Todo");
  if (container.hasClass('hide')) {
    container.removeClass('hide');
    $('#todo_edit_overlay_fab').addClass('hide')
    $('#todo_overlay_fab').removeClass('hide')
    var originalHeight = $(e.parentNode).height();
    $(e.parentNode).height((originalHeight+50)+"px");
  }
}

function everyDaySelect(e) {
  var checked = false;
  if (e.checked) {
    checked = true;
  }
  $('#todo_repeat_days').find('input').each(function() {
    $(this).prop('checked', checked);
  });
}

function checkUnCheckEveryday(e) {
  var everydaySelected = true;
  $('#todo_repeat_days').find('input').each(function() {
    if (!this.checked) {
      everydaySelected=false;
    }
  });
  $('#todo_everydaySelector').prop('checked', everydaySelected);
}

function cloneTodoTemplate(title, description, repeat, id) {
  var t = document.querySelector('#template_todoItem');
  var span = t.content.querySelector('span');
  while( span.firstChild ) {
    span.removeChild( span.firstChild );
  }
  span.appendChild( document.createTextNode(title) );
  t.content.querySelector('div').dataset.todoid =id;

  var clone = document.importNode(t.content, true);
  document.getElementById("todo_todoUL").appendChild(clone);
}

function updateTodo(e) {
  var title = $("#todo_title").val();
  var description= $("#todo_descr").val();
  var todoID = $('#todo_hidden_id').text();

  var repeat = [];
  var i = 0;
  $('#todo_repeat_days').find('input').each(function() {
    repeat[i] = this.checked;
    i++;
  });
  if (title) {
    var listLen = $('#todo_todoUL li').length;
    // Clones the template and adds into the DOM tree

    // Add Into Local Storage
    if (!localStorage.getItem("bookmark_todoStorage")) {
      var tempArray = [];
      var todoStorage = localStorage.setItem("bookmark_todoStorage", JSON.stringify(tempArray));
    }
    var todoArray = JSON.parse(localStorage.getItem("bookmark_todoStorage"));
    var todoToEdit = null;
    for (var i = 0; i < todoArray.length; i++) {
      var todo =todoArray[i];
      if (todo.uuid == todoID) {
        todoToEdit = todo;
        todoToEdit.title = title;
        todoToEdit.description = description;
        todoToEdit.repeat = repeat;
        break;
      }
    }

    var todoStorage = localStorage.setItem("bookmark_todoStorage", JSON.stringify(todoArray));
    var objToday = new Date();
    if ((!isRepeatingTodo(todoToEdit)) || (isRepeatingTodo(todoToEdit) && todoToEdit.repeat[objToday.getDay()] )) {
      updateTodoInList(e, todoToEdit,todoID);
    }
    // Closes the Add View
    closeAddTodo();
    $('.todoListContainer').find('h2').addClass('hide');
  }

}

function updateTodoInList(e, todo, id) {
  $('#todo_todoUL').find('li').each(function() {
    if ($(this).find('div').data('todoid') == id) {
      $(this).find('div').find('span').text(todo.title);
    }
  });
}

function removeTodoInList(id) {
  $('#todo_todoUL').find('li').each(function() {
    if ($(this).find('div').data('todoid') == id) {
      $(this).remove();
    }
  });
}

function deleteTodo(e) {
  var todoID = $('#todo_hidden_id').text();
  if (!localStorage.getItem("bookmark_todoStorage")) {
    var tempArray = [];
    var todoStorage = localStorage.setItem("bookmark_todoStorage", JSON.stringify(tempArray));
  }
  var todoArray = JSON.parse(localStorage.getItem("bookmark_todoStorage"));
  for (var i = 0; i < todoArray.length; i++) {
    var todo =todoArray[i];
    if (todo.uuid == todoID) {
      todoArray.splice(i, 1);
      removeTodoInList(todoID);
      break;
    }
  }
  localStorage.setItem("bookmark_todoStorage", JSON.stringify(todoArray));
  closeAddTodo();
  $('#todo_title').val('');
}

function createNewTodo(e) {
  $('#deleteTodoContainer').addClass('hide');
  var title = $("#todo_title").val();
  var description= $("#todo_descr").val();
  var repeat = [];
  var i = 0;
  $('#todo_repeat_days').find('input').each(function() {
    repeat[i] = this.checked;
    i++;
  });
  if (title) {
    var listLen = $('#todo_todoUL li').length;
    // Clones the template and adds into the DOM tree
    var todoID = guid();

    // Add Into Local Storage
    if (!localStorage.getItem("bookmark_todoStorage")) {
      var tempArray = [];
      var todoStorage = localStorage.setItem("bookmark_todoStorage", JSON.stringify(tempArray));
    }
    var todoArray = JSON.parse(localStorage.getItem("bookmark_todoStorage"));
    var tempTodo = {};
    tempTodo.title = title;
    tempTodo.description = description;
    tempTodo.repeat = repeat;
    tempTodo.uuid = todoID;
    todoArray.push(tempTodo);
    var todoStorage = localStorage.setItem("bookmark_todoStorage", JSON.stringify(todoArray));
    var objToday = new Date();
    if ((!isRepeatingTodo(tempTodo)) || (isRepeatingTodo(tempTodo) && tempTodo.repeat[objToday.getDay()] )) {
      cloneTodoTemplate(title, description, repeat,todoID);
    }
    // Closes the Add View
    closeAddTodo();
    $('.todoListContainer').find('h2').addClass('hide')
  }
}

function expandTodoInfoEdit(e) {
  var todoID = $(e.parentNode).data('todoid');
  $('#todo_hidden_id').text(todoID);

  var title = $(e).parent().find('.label--checkbox').find('span').text();
  $('#todo_title').val(title)
  $("#todo_addEdit_Title").text("Edit Todo");
  var addContainer = $('#todo_todoListAddEditContainer');
  if (addContainer.hasClass('hide')) {
    addContainer.removeClass('hide');
    var originalHeight = addContainer.parent().height();
    addContainer.parent().height((originalHeight+50)+"px");
    $('#todo_edit_overlay_fab').removeClass('hide')
    $('#todo_overlay_fab').addClass('hide');
    $('#deleteTodoContainer').removeClass('hide');
  }
  else {
    addContainer.addClass('hide');
    var originalHeight = $(e.parentNode).height();
    addContainer.parent().height((originalHeight-50)+"px");
    $('#todo_title').val('');
  }
}

/* Package Stuff */
function createpackage_callBack(title, orderNum, service, trackpackage_body) {
  $.ajax({
    url: '/api/trackpackage',
    type: 'GET',
    data: trackpackage_body,
    dataType: 'json',
    success: function (parsedResponse, statusText, jqXhr) {
      clonePackageTrackerTemplate(title,
                                  orderNum,
                                  service,
                                  parsedResponse);
    },
    error: function (error) {
        var status_code = error.status;
        var status_text = error.statusText;
        var data = jQuery.parseJSON(error.responseText);
        console.log('err')
    }
  });
}

function clonePackageTrackerTemplate(title, orderNum, selectOption, parsedResponse) {
  var expectedDate = parsedResponse.expectedDate;
  var package_status = parsedResponse.status;
  var package_location = parsedResponse.location;
  var t = document.querySelector('#template_trackPackage');
  var aTag = t.content.querySelector('a');
  var serviceLink = '';
  if (selectOption == "FEDEX") {
    serviceLink = "https://www.fedex.com/apps/fedextrack/?action=track&action=track&language=english&cntry_code=us&tracknumbers="+orderNum;
    aTag.setAttribute('title', "FEDEX: #" + orderNum);
  }
  else if (selectOption == "USPS") {
    serviceLink = "https://tools.usps.com/go/TrackConfirmAction.action?tRef=fullpage&tLc=1&text28777=&tLabels="+orderNum;
    aTag.setAttribute('title', "USPS: #" + orderNum);
  }
  else if (selectOption == "UPS") {
    serviceLink = "https://www.fedex.com/apps/fedextrack/?action=track&action=track&language=english&cntry_code=us&tracknumbers="+orderNum;
    aTag.setAttribute('title', "UPS: #" + orderNum);
  }

  aTag.setAttribute('href',serviceLink);

  var titleTag = t.content.querySelector('h1');
  while( titleTag.firstChild ) {
    titleTag.removeChild( titleTag.firstChild );
  }
  titleTag.appendChild( document.createTextNode(title) );

  var statusTag = t.content.querySelector('h2');
  while( statusTag.firstChild ) {
    statusTag.removeChild( statusTag.firstChild );
  }
  statusTag.appendChild( document.createTextNode(package_status) );

  var dateTage = t.content.querySelector('h3');
  while( dateTage.firstChild ) {
    dateTage.removeChild( dateTage.firstChild );
  }
  if (package_status.indexOf('Delivered') >-1) {
    dateTage.appendChild( document.createTextNode("Arrived: " + expectedDate) );
  }
  else
    dateTage.appendChild( document.createTextNode("Estimated Arrival: " + expectedDate) );

  var clone = document.importNode(t.content, true);
  document.getElementById("package_packageList").appendChild(clone);
}

function deletePackage(e) {
  $(e).parent().parent().remove();
}
function updatePackage(e) {

}

function checkTracking(orderNum) {
  orderNum = orderNum.trim();
  // Working
  var usps = new RegExp('\\b(\\d\\d\\d\\d ?\\d\\d\\d\\d ?\\d\\d\\d\\'+
	'd ?\\d\\d\\d\\d ?\\d\\d\\d\\d ?\\d\\d|\\d\\d\\d\\d ?\\d\\d\\d\\d ?\\d'+
	'\\d\\d\\d ?\\d\\d\\d\\d ?\\d\\d\\d\\d)\\b');
  // Working?
  var UPSRegex = new RegExp('/\b(1Z ?[0-9A-Z]{3} ?[0-9A-Z]{3} ?[0-9A-Z]{2} ?[0-9A-Z]{4} ?[0-9A-Z]{3} ?[0-9A-Z]|[\dT]\d\d\d ?\d\d\d\d ?\d\d\d)\b/');
  var FEXRegex1 = new RegExp('/^(((96|98)\d{5}\s?\d{4}$|^(96|98)\d{2})\s?\d{4}\s?\d{4}(\s?\d{3})?)$/i');
  //var FEXRegex2 = new RegExp('\b((98\d\d\d\d\d?\d\d\d\d|98\d\d) ?\d\d\d\d ?\d\d\d\d( ?\d\d\d)?)\b', 'ig');
  //var FEXRegex3 = new RegExp('^[0-9]{12}$', 'ig');

  var url="http://wwwapps.ups.com/WebTracking/track?loc=en_US&track.x=Track&trackNums="+ orderNum;
  var url2="http://fedex.com/Tracking?action=track&language=english&cntry_code=us&tracknumbers="+orderNum;
  var url3="https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=" + orderNum;

  var isUSPS = usps.test(orderNum);
  var isUPS = UPSRegex.test(orderNum);
  var isFEDEX = FEXRegex1.test(orderNum);

  console.log('USPS: ' + isUSPS);
  console.log('UPS: ' + isUPS);
  console.log('FEDEX1: ' + isFEDEX);
  //console.log('FEDEX2: ' + isFEDEX2);
  //console.log('FEDEX3: ' + isFEDEX3);

}

function createNewPackage() {
  alert('creating new package');
  var title = $("#package_title").val();
  var orderNum =$("#package_order_number").val();
  var selectOption =$("#package_select_service").find('select').val();

  var addContainer = $('#package_ListAddEditContainer');
  $('#nopackagelabel').addClass('hide');
  if (title && orderNum && selectOption) {

    var trackpackage_body = {orderNum: orderNum,
                             service: selectOption};
    createpackage_callBack(title, orderNum, selectOption, trackpackage_body);

    closeNewPackage();

    // Add Into Local Storage
    if (!localStorage.getItem("bookmark_packageStorage")) {
      var tempArray = [];
      var todoStorage = localStorage.setItem("bookmark_packageStorage", JSON.stringify(tempArray));
    }
    var tmpArray = JSON.parse(localStorage.getItem("bookmark_packageStorage"));
    var tempTodo = {};
    tempTodo.title = title;
    tempTodo.orderNum = orderNum;
    tempTodo.service = selectOption;

    tmpArray.push(tempTodo);
    localStorage.setItem("bookmark_packageStorage", JSON.stringify(tempArray));

    

  }
}

function addNewPackage(e) {
  var addContainer = $('#package_ListAddEditContainer');
  if(addContainer.hasClass('hide')) {
    addContainer.removeClass('hide');
    $(e).parent().find('ul').addClass('hide');
  }
}

function closeNewPackage(e) {
  var addContainer = $('#package_ListAddEditContainer');
  addContainer.addClass('hide')
  $('#package_title').val('');
  $('#package_order_number').val('');
  addContainer.parent().find('#package_actionfab').removeClass('hide');
  addContainer.parent().find('ul').removeClass('hide');
}

/*
 * Init
 */

function setUpWeather(getBody) {
  var objToday = new Date();
  // Sets Up the Date
  function nth(d) {
  if(d>3 && d<21) return 'th';
  switch (d % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
    }
  }

  // Day Of Week
  var weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
  var dayOfWeek = weekday[objToday.getDay()];

  // Month
  var months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
  var curMonth = months[objToday.getMonth()];

  // Year
  var year = objToday.getFullYear();

  // Day
  var day = objToday.getDate();
  var nthDay = nth(day);

  $("#w_monthAndDate").text(curMonth + " " +day+nthDay);
  $("#w_dayOfTheWeek").text(dayOfWeek);

  var hour = objToday.getHours();
  var todayParsed = year+"."+objToday.getMonth()+"."+day+"."+hour;

  function displayWeather(responseText) {
    fDeg = responseText.temp_f;
    cDeg = responseText.temp_c;

    $("#weather_degrees").text(parseInt(fDeg));
    console.log(responseText);
    $('#currentWeather').removeAttr("class");
    $('#currentWeather').addClass('wi');
    if (hour >= 19 || hour < 6) {
      $('#currentWeather').addClass('wi-night-alt-cloudy');
    }
    else {
      if (fDeg>70 || responseText.wx_desc.indexOf('Sunny') > -1 ) {
        $('#currentWeather').addClass('wi-day-sunny');
      }
      else if (responseText.winddir_deg >50 ){
        $('#currentWeather').addClass('wi-day-cloudy-windy');
      }
      else if (responseText.wx_desc.indexOf('rain')> -1) {
        $('#currentWeather').addClass('wi-rain');
      }
      else if (responseText.wx_desc.indexOf('thunder') > -1 ) {
        $('#currentWeather').addClass('wi-lightning');
      }
      else {
        $('#currentWeather').addClass('wi-day-cloudy');
      }
    }
  }

  var expired_time = 15*60*1000; // 15 minutes
  var cached_weather = JSON.parse( localStorage.getItem("bookmark_weather") );
  if (cached_weather) {
    displayWeather(cached_weather);
  }
  // If theres no cache or if the weather is 15 minutes old
  if ( !cached_weather || (new Date(cached_weather.timestamp).getTime() +  expired_time) < new Date().getTime()  ) {
    $.ajax({
        url: '/api/getweather',
        type: 'GET',
        data: getBody,
        success: function (parsedResponse, statusText, jqXhr) {
            var responseText = JSON.parse(jqXhr.responseText);
            responseText.timestamp = new Date();
            localStorage.setItem("bookmark_weather", JSON.stringify(responseText));
            displayWeather(responseText);
        },
        error: function (error) {
          console.log(error)
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

function setUpToday() {

  var objToday = new Date();

  function setUpTodoList() {
    if (!localStorage.getItem("bookmark_todoStorage")) {
      var tempArray = [];
      localStorage.setItem("bookmark_todoStorage", JSON.stringify(tempArray));
    }
    var todoArray = JSON.parse(localStorage.getItem("bookmark_todoStorage"));
    if (!localStorage.getItem("bookmark_todoHistory")) {
      var tempArray = [];
      localStorage.setItem("bookmark_todoHistory", JSON.stringify(tempArray));
    }
    var checkedOffRepeats = JSON.parse(localStorage.getItem("bookmark_todoHistory"));

    var i = 0;
    var todoArrayLen = todoArray.length;
    var checkedOffToday = [];
    for (var j = 0; j<checkedOffRepeats.length; j++) {
      if (isSameDay( checkedOffRepeats[j].date,objToday )) {
        checkedOffToday= checkedOffRepeats[j].checkedOff;
        break;
      }
    }
    var needtoDoCounter = 0;
    for (; i < todoArrayLen; i++) {
      var tmpTodoItem = todoArray[i];
      if (checkedOffToday.indexOf(tmpTodoItem.uuid) !== -1)
        continue;
      if ((!isRepeatingTodo(tmpTodoItem)) || (isRepeatingTodo(tmpTodoItem) && tmpTodoItem.repeat[objToday.getDay()] )) {
        needtoDoCounter++;
        cloneTodoTemplate(tmpTodoItem.title, tmpTodoItem.description, tmpTodoItem.repeat, tmpTodoItem.uuid);
      }
    }
    if (needtoDoCounter == 0) {
      $('.todoListContainer').find('h2').removeClass('hide')
    }
  }

  function setUpPackageList() {

    // Change to fetch from DB
    if (!localStorage.getItem("bookmark_packageStorage")) {
      var tempArray = [];
      localStorage.setItem("bookmark_packageStorage", JSON.stringify(tempArray));
    }
    var todoArray = JSON.parse(localStorage.getItem("bookmark_packageStorage"));
    var i = 0;
    var todoArrayLen = todoArray.length;

    for (; i < todoArrayLen; i++) {
      var tmpTodoItem = todoArray[i];
      var trackpackage_body = {orderNum: tmpTodoItem.orderNum,
                               service: tmpTodoItem.service};
      var title = tmpTodoItem.title;
      var orderNum = tmpTodoItem.orderNum;
      var service = tmpTodoItem.service;
      createpackage_callBack(title, orderNum, service, trackpackage_body);

    }
    if (todoArrayLen==0) {
      $('.todoScheduleContainer').find('h2').removeClass('hide')
    }
  }

  setUpPackageList();
  setUpTodoList();
  checkAuth();

  if (localStorage.getItem('b_geo')) {
    setUpWeather( JSON.parse(localStorage.getItem('b_geo')) );
  }
  // Sets Up Location
  $.get("http://ipinfo.io", function(response) {
    $("#w_location").text(response.city);
    var geo = response.loc;

    var getBody = {};
    getBody.geo = geo;
    getBody.postal = response.postal;
    localStorage.setItem('b_geo', JSON.stringify(getBody));
    setUpWeather(getBody);

  }, "jsonp");

}
