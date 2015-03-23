(function(angular) {
    'use strict';

    var app = angular.module('mgmtsystem', ['ngRoute', 'nvd3ChartDirectives']);

    //local storage factory
    app.factory("LS", function($window, $rootScope) {
        angular.element($window).on('storage', function(event) {
            if (event.key === 'my-storage') {
                $rootScope.$apply();
            }
        });
        return {
            setData: function(val) {
                $window.localStorage && $window.localStorage.setItem('my-storage', val);
                return this;
            },
            getData: function() {
                return $window.localStorage && $window.localStorage.getItem('my-storage');
            }
        };
    });

    //controller strats here
    app.controller('MainCtrl', function($scope, $route, $routeParams, $location, LS) {

        /************ bootstrap menu active class *************************/
        $scope.isActive = function(viewLocation) {
            return viewLocation === $location.path();
        };

        /************ set local storage default value *************************/

        if (LS.getData() === null) {
            LS.setData(JSON.stringify(defaultFrogs));
        }

        $scope.$frogs = JSON.parse(LS.getData());

        /**************  form validation and add new frog to the table ********************/

        //variable used inside HTML : form 
        $scope.newFrog = {};

        //method called while user submits
        $scope.add = function(form, formObj) {
            if (form.$valid) {

                $scope.showError = false;
                $scope.showMsg = true;

                //add the new frog to the frogs json
                $scope.$frogs.push($scope.newFrog);
                //updte localstorage
                LS.setData(JSON.stringify($scope.$frogs));
                //update chart
                watchFrogs();

                //reset the form when successfull
                $scope.newFrog = angular.copy({});
                if (form) {
                    form.$setPristine();
                    form.$setUntouched();
                }

            } else if (form.$invalid) {

                $scope.showError = true;
                $scope.showMsg = false;

            }
        };


        /*************** watch for new frogs added **********************/

        function watchFrogs() {
            $scope.$watch(function() {
                return $scope.$frogs;
            }, function(newValue, oldValue) {
                //update the scope for the chart data
                $scope.genderCount = _.chain(newValue).countBy("sex").pairs().sortBy(1).value();
            });
        };
        watchFrogs();

        /*************** END watch for new frogs added **********************/


        /*************** chart fns x & y axis**********************/
        $scope.xfn = function() {
            return function(d) {
                return d[0];
            }
        };
        $scope.yfn = function() {
            return function(d) {
                return d[1];
            };
        };
        /*************** END  chart fns **********************/

    });


    //angular routes
    app.config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/addnew', {
                templateUrl: 'assets/templates/addnew.html'
            }).when('/home', {
                templateUrl: 'assets/templates/home.html'
            }).otherwise({
                redirectTo: '/home'
            });
    });

})(window.angular);
