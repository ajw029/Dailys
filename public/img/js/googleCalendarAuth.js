var CLIENT_ID = '170393284527-khtieshvmf020pruto48pghqat06nj2l.apps.googleusercontent.com';

var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

function showScheduleSettings() {
  if ($("#schedule_scheduleAddContainer").hasClass('hide')) {
    $("#schedule_scheduleAddContainer").removeClass('hide');
    $('#todo_scheduleList').addClass('hide');
    $("#schedule_outerContainer").height('276px');
  }
}

function closeScheduleSettings() {
  if (!$("#schedule_scheduleAddContainer").hasClass('hide')) {
    $("#schedule_scheduleAddContainer").addClass('hide');
    $('#todo_scheduleList').removeClass('hide');
    $("#schedule_outerContainer").height('100%');
  }
}

function checkAuth() {
gapi.auth.authorize(
  {
    'client_id': CLIENT_ID,
    'scope': SCOPES.join(' '),
    'immediate': true
  }, handleAuthResult);
}

function handleAuthResult(authResult) {
  var authorizeDiv = document.getElementById('authorize-div');
  if (authResult && !authResult.error) {
    // Hide auth UI, then load client library.
    loadCalendarApi();
  }
}
function handleAuthClick(event) {
  gapi.auth.authorize(
    {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
    handleAuthResult);
    return false;
  }

  /**
  * Load Google Calendar client library. List upcoming events
  * once client library is loaded.
  */
function loadCalendarApi() {
  gapi.client.load('calendar', 'v3', listUpcomingEvents);
}

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

function cloneEventTemplate(title, location, start, end) {
  var t = document.querySelector('#template_calendarEvent');
  var titleTag = t.content.querySelector('h1');
  while( titleTag.firstChild ) {
    titleTag.removeChild( titleTag.firstChild );
  }
  var timeTag = t.content.querySelector('h2');
  while( timeTag.firstChild ) {
    timeTag.removeChild( timeTag.firstChild );
  }
  var locationTag = t.content.querySelector('h3');
  while( locationTag.firstChild ) {
    locationTag.removeChild( locationTag.firstChild );
  }
  titleTag.appendChild( document.createTextNode(title) );
  if (start&&end)
     timeTag.appendChild( document.createTextNode(start + "-" +end) );
  else if (start)
     timeTag.appendChild( document.createTextNode(start) );

  if (location) {
    locationTag.appendChild( document.createTextNode(location) );
  }

  var clone = document.importNode(t.content, true);
  document.getElementById("todo_scheduleList").appendChild(clone);
}

function listUpcomingEvents() {
  var today = new Date();
  var tomorrow = today.getTime() + (1000*3600*24);
  var tomorrowDate = new Date(tomorrow);
  tomorrowDate.setHours(0);
  tomorrowDate.setMinutes(0);
  var request = gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'timeMax': (tomorrowDate).toISOString(),
    'orderBy': 'startTime'
  });

  request.execute(function(resp) {
    var events = resp.items;
    var myEvents = [];
    if (events.length > 0) {
      $("#todo_scheduleList").empty();

      for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        if (!when) {
          when = event.start.date;
        }
        myEvents.push(event);

        cloneEventTemplate(event.summary, event.location, formatAMPM(new Date(event.start.dateTime)),formatAMPM(new Date(event.end.dateTime))  );
      }
      closeScheduleSettings();
    }
  });
}
