'use strict';

angular.module('vagrantlistApp').controller(
    'TableController',
    function ($scope) {

        var current = -1;

        $scope.onClick = function(index) {
            if( current == index ) {
                current = -1;
            } else {
                current = index;
            }
        };

        $scope.isInfoVisible = function(index) {
            return current == index;
        }
    }
);
