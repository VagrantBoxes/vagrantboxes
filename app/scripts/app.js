'use strict';

// create the app module
var AppModule = angular.module('vagrantlistApp', ['ngResource', 'ngRoute']);

// configure the routes for the newly created module
AppModule.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/list.html',
            controller: 'ListController'
        })
        .when('/suggest', {
            templateUrl: 'views/suggest.html'
        })
        .otherwise({
            redirectTo: '/'
        });
});

// initialize the menu controller to change the 'active' state
AppModule.controller(
    'MenuController',
    function ($scope) {

        /**
         * Index of the current active menu item
         * @type {number}
         */
        $scope.current_active = 0;

        /**
         * Menu items being populated at runtime
         * @type {Array}
         */
        $scope.items = [
            {
                text: "Boxes",
                route: "/",
                active: true
            },
            {
                text: "Suggest a box",
                route: "/suggest",
                active: false
            }
        ];

        /**
         * Change the active state when a menu item is clicked
         * @param index
         */
        $scope.click = function(index) {
            $scope.items[$scope.current_active].active = false;
            $scope.items[index].active = true;
            $scope.current_active = index;
        }
    }
);

AppModule.factory('DebianBoxes', function($http) {
    var boxes = {};
    boxes.query = function() {

//        $http
//            .get('boxes/debian.json')
//            .success(function(data, status, headers, config) {
//                console.log(data);
//            });

        return [
            {
                "name": "Aegir-up Aegir (Debian Squeeze 6.0.4 64-bit)",
                "url": "http://ergonlogic.com/files/boxes/aegir-current.box",
                "provider": "VirtualBox",
                "size": "297 MB"
            },
            {
                "name": "Aegir-up Debian (Debian Squeeze 6.0.4 64-bit)",
                "url": "http://ergonlogic.com/files/boxes/debian-current.box",
                "provider": "VirtualBox",
                "size": "283 MB"
            },
            {
                "name": "Aegir-up LAMP (Debian Squeeze 6.0.4 64-bit)",
                "url": "http://ergonlogic.com/files/boxes/debian-LAMP-current.box",
                "provider": "VirtualBox",
                "size": "388 MB"
            }
        ];
    };

    return boxes;
});