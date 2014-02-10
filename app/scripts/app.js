'use strict';

// configure the routes for the newly created module
angular
    .module(
        'vagrantlistApp',
        ['vagrantlistApp.services', 'ui.bootstrap', 'ngResource', 'ngRoute']
    )
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/list.html',
                controller: 'ListController'
            })
            .when('/suggest', {
                templateUrl: 'views/suggest.html',
                controller: 'SuggestController'
            })
            .otherwise({
                redirectTo: '/'
            });
    });