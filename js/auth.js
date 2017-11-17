/* Handle Google Authentication */


// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
//var CLIENT_ID = '15469523491-jv0g2fqq1a2krld9cbstga8jk17p6cqo.apps.googleusercontent.com';
var CLIENT_ID = '15469523491-3q6hd5h1j3ruk3cmuvof8jeqv7gi9alp.apps.googleusercontent.com';

// This quickstart only requires read-only scope, check
// https://developers.google.com/google-apps/calendar/auth if you want to
// request write scope.
var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
    gapi.auth.authorize(
        {
            'client_id': CLIENT_ID,
            'scope': SCOPES,
            'immediate': true
        }, handleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
    var authorizeDiv = document.getElementById('authorize-div');
    if (authResult && !authResult.error) {
        // Hide auth UI, then load Calendar client library.
        authorizeDiv.style.display = 'none';
        loadCalendarApi();
    } else {
        // Show auth UI, allowing the user to initiate authorization by
        // clicking authorize button.
        authorizeDiv.style.display = 'inline';
    }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
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
    gapi.client.load('calendar', 'v3', start);
}


function start(){
$('.app').show();
angular.bootstrap(document, ['meetingRoomApp']);

}