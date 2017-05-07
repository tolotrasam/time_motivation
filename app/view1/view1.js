'use strict';

angular.module('myApp.view1', ['ngRoute', 'timer', 'ngMaterial',"smDateTimeRangePicker"])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])
    .config(function ($mdThemingProvider) {
        // Update the theme colors to use themes on font-icons
        $mdThemingProvider.theme('default')
            .primaryPalette("green")
            .accentPalette('green')
            .warnPalette('green');
    })
    .config(function ($mdIconProvider) {
        $mdIconProvider.iconSet("avatar", '../flavicon.png', 128);
    })
    .directive("directive", function () {
        return {
            restrict: "A",
            require: "ngModel",
            link: function (scope, element, attrs, ngModel) {

                function handlePaste(e) {
                    var clipboardData, pastedData;

                    // Stop data actually being pasted into div
                    e.stopPropagation();
                    e.preventDefault();

                    // Get pasted data via clipboard API
                    clipboardData = e.clipboardData || window.clipboardData;
                    pastedData = clipboardData.getData('Text');

                    // Do whatever with pasteddata
                    alert(pastedData);
                }

                function read() {
                    // view -> model
                    var html = element.html().replace(/<[^>]*>/g, "");
                    html = html.replace(/&nbsp;/g, "\u00a0");
                    ngModel.$setViewValue(html);
                }

                // element.addEventListener('paste', handlePaste);
                // model -> view
                ngModel.$render = function () {
                    element.html(ngModel.$viewValue || "");
                };
                element.bind("pasteasdf", function (e) {
                    var clipboardData, pastedData;
                    // Stop data actually being pasted into div
                    e.stopPropagation();
                    e.preventDefault();

                    // Get pasted data via clipboard API
                    clipboardData = e.clipboardData || window.clipboardData;
                    pastedData = clipboardData.getData('Text');

                    // Do whatever with pasteddata
                    alert(pastedData);
                });
                element.on('paste', function (e) {
                    e.preventDefault();
                    var text;
                    var clp = (e.originalEvent || e).clipboardData;
                    if (clp === undefined || clp === null) {
                        text = window.clipboardData.getData("text") || "";
                        if (text !== "") {
                            text = text.replace(/<[^>]*>/g, "");
                            if (window.getSelection) {
                                var newNode = document.createElement("span");
                                newNode.innerHTML = text;
                                window.getSelection().getRangeAt(0).insertNode(newNode);
                            } else {
                                document.selection.createRange().pasteHTML(text);
                            }
                        }
                    } else {
                        text = clp.getData('text/plain') || "";
                        if (text !== "") {
                            text = text.replace(/<[^>]*>/g, "");
                            document.execCommand('insertText', false, text);
                        }
                    }
                });

                element.bind("blur keyup change", function () {
                    scope.$apply(read);
                });
                element.bind("keydown keypress", function (event) {
                    if (event.which === 13) {
                        this.blur();
                        event.preventDefault();
                    }
                });
            }
        };
    })
    .directive('countdown', [
        'Util', '$interval', function (Util, $interval) {
            return {
                restrict: 'A',
                scope: {
                    date: '@'
                },
                link: function (scope, element) {
                    var future;
                    future = new Date(Number(scope.date));
                    $interval(function () {
                        var diff;
                        diff = Math.floor((future.getTime() - new Date().getTime()));
                        return element.text(Util.dhms(diff));
                    }, 100);
                }
            };
        }
    ]).factory('Util', [
    function () {
        return {
            dhms: function (t) {
                var days, hours, minutes, seconds;
                days = Math.floor(t / 86400000);
                t -= days * 86400000;
                hours = Math.floor(t / 3600000) % 24;
                t -= hours * 3600000;
                minutes = Math.floor(t / 60000) % 60;
                t -= minutes * 60000;
                seconds = Math.floor(t / 1000) % 60;
                t -= seconds * 1000;
                return [days + 'd', hours + 'h', minutes + 'm', seconds + 's'].join(' ');
            }
        };
    }
])
    .controller('View1Ctrl', ['$scope', '$interval', 'Util', function ($scope, $interval, Util) {

        $scope.data = [];
        $scope.data.startTime = 1514750900050;
        $scope.startTime = 1514750900050;
        $scope.endTime = 1514750400000;
        $scope.data.endTime = 1514750400000;
        $scope.myFunctions = [];
        $scope.errors = [];
        $scope.save_all = function () {
            window.localStorage['timer_motivation'] = angular.toJson($scope.data.content);
            console.log('saved overwritten')
        }
        $scope.saveAndUpdateChanges = function (event) {
           event.date_millis = (new Date(event.time)).getTime()
        }
        $scope.save_new = function () {
            if (!$scope.data.content) {
                $scope.data.content = []
            }
            $scope.data.new.date_millis = (new Date($scope.data.new.time)).getTime();

            if ($scope.data.new.date_millis < (new Date()).getTime()) { //do not allow past event
                $scope.errors.push({label: 'date', message: 'do not allow past event'})
                // return
            }
            $scope.data.new.timestamp = (new Date()).getTime()
            $scope.data.content.push(angular.copy($scope.data.new));
            $scope.save_all();
            if (!$scope.countdownInterval) {
                $scope.countdown();
            }
            $scope.init_tiles();
            //console.log($scope.data, 'scope data')
        };


        $scope.init_tiles = function () {
            if ($scope.data.content) {
                for (var j = 0; j < $scope.data.content.length; j++) {
                    var event_tile = $scope.data.content[j];
                    if (typeof ($scope.data.content[j]) == 'undefined') {
                        event_tile = [];
                        $scope.data.content.push(event_tile)
                    }
                    event_tile.span = {row: 1, col: 1};
                    if (!event_tile.title) {
                        event_tile.title = 'No title'
                    }

                    switch (j + 1) {
                        case 1:
                            event_tile.background = "red";
                            event_tile.span.row = event_tile.span.col = 2;
                            break;

                        case 2:
                            event_tile.background = "green";
                            break;
                        case 3:
                            event_tile.background = "darkBlue";
                            break;
                        case 4:
                            event_tile.background = "blue";
                            event_tile.span.col = 2;
                            break;

                        case 5:
                            event_tile.background = "yellow";
                            event_tile.span.row = event_tile.span.col = 2;
                            break;

                        case 6:
                            event_tile.background = "pink";
                            break;
                        case 7:
                            event_tile.background = "darkBlue";
                            break;
                        case 8:
                            event_tile.background = "purple";
                            break;
                        case 9:
                            event_tile.background = "deepBlue";
                            break;
                        case 10:
                            event_tile.background = "lightPurple";
                            break;
                        case 11:
                            event_tile.background = "yellow";
                            break;
                    }

                }
            }
        }
        $scope.init = function () {
            if (!$scope.data.content) {
                $scope.data.content = angular.fromJson(window.localStorage['timer_motivation']);
            }
            $scope.init_tiles();
            $scope.countdown();

        };

        $scope.delete_index = function (index) {
            $scope.data.content.splice(index, 1)
            $scope.save_all()
            $scope.init_tiles();
        }
        $scope.countdown = function () {
            if ($scope.data.content) {
                $scope.countdownInterval = $interval(function () {
                    for (var event of  $scope.data.content) {
                        var diff, percentage;
                        diff = (Number((event.date_millis) - (new Date()).getTime()) );
                        percentage = 100 * (1 - diff / ( Number(event.date_millis) - Number(event.timestamp)));
                        // console.log(diff,'percentage')
                        event.countdown = (Util.dhms(diff));
                        event.percentage = percentage
                    }

                }, 100);
            }

        };
        $scope.debug = function () {
            console.log($scope.data, ' debug')
            console.log($scope.tiles, ' tiles')
            console.log((new Date()).getTime(), ' current timestamp')
        };
        $scope.myFunctions.getTimeMills = function () {
            return (new Date()).getTime()
        };
        $scope.myFunctions.getToday = function () {
            var now = new Date();
            return now;
        };
        $scope.myFunctions.getDateFormattedString = function (date) {
            var date = new Date(date)
            var dd = date.getDate()+1;
            var mm = date.getMonth()+1; //January is 0!
            var yyyy = date.getFullYear();

            if(dd<10) {
                dd='0'+dd
            }

            if(mm<10) {
                mm='0'+mm
            }

            date = mm+'-'+dd+'-'+yyyy;
            //console.log(date,'date')
            return date;
        }
        $scope.today = $scope.myFunctions.getDateFormattedString(new Date());

        $scope.init();


    }]);