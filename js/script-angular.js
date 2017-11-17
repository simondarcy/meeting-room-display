var myApp = angular.module('meetingRoomApp', []);


/*helper functions */

function isLive(startdate, enddate){
    //Function to check if "now" is between 2 dates thus "live"
    var start = moment(startdate);
    var end = moment(enddate);
    var now = moment();
    return !!(now > start && now < end)
}

function getDuration(event){
    //Get the duration of an event. Time between start and end
    var ms = moment(event.end.dateTime).diff(moment(event.start.dateTime));
    var d = moment.duration(ms);

    hrs = Math.floor(d.asHours());
    mins = moment.utc(ms).format("mm");

    str =  "";
    if (hrs > 0)  str = str + hrs + ' hr ';
    if (parseInt(mins) > 0) str = str + mins + ' mins';

    return str;
}

myApp.controller('scheduleCtrl', ['$scope', '$http', '$interval',
    function($scope, $http, $interval) {
        /*
         schedule Controller
         Gets list of events from Google calendar every minute and updates scope
         */

        $scope.events = [];

        $scope.update = function(){
            //Get new events and update the scope accordingly

            //grab the first 2 events from list of calender events
            $scope.now = $scope.events[0];
            $scope.next = $scope.events[1];

            //Calculate the duration of each event
            $scope.now.duration = getDuration($scope.now);
            $scope.next.duration = getDuration($scope.next);

            // is there someone in a meeting now?
            if ( isLive($scope.now.start.dateTime, $scope.now.end.dateTime) ){
                //yes flag as occupied
                $scope.now.occupied =  true;
                //work out how long room is occupied for
                a = moment().format();
                b = moment().format($scope.now.end.dateTime);
                $scope.now.remaining =  moment(b).from(moment(a)).replace('in', '');
            }
            else{ //Else room is free? Calculate how long room is vacant for?
                a = moment().format();
                b = moment().format($scope.now.start.dateTime);
                $scope.now.remaining =  moment(b).from(moment(a)).replace('in', '');
            }


            //Are the 2 meeting straight after one another? Double red screen
            if($scope.now.end.dateTime == $scope.next.start.dateTime){
                $scope.next.occupied =  true;
            }

            //Flag if there is no meeting for the next 8 hours, this is the full screen interface with image
            var hoursToNextMeeting = Math.floor( moment.duration( moment( $scope.now.start.dateTime ).diff(moment( moment().format() )) ).asHours() );
            $scope.clear = (hoursToNextMeeting > 8);

            //update the scope
            $scope.$apply();

        };//end update function

        $scope.getEvents = function(){
            //Function to get a list of events from Google Calendar API

            //make request to google api
            var request = gapi.client.calendar.events.list({
                'calendarId': 'rte.ie_34363934363636352d383730@resource.calendar.google.com',
                'timeMin':moment().format(),
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 10,
                'orderBy': 'startTime'

            });


            //Execute the request to Google Calendar API, on success update scope
            request.execute(function(response) {
                if(response.code != null && response.code==403){
                    location.reload();
                }else{
                    $scope.events = response.items;
                    $scope.update();
                }
            });
        };

        //Make initial call to get events
        $scope.getEvents();

        //Get events every minute
        $interval($scope.getEvents, 60000);
     
    }]);//end controller
