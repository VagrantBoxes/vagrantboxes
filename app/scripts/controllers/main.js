'use strict';

angular.module('vagrantlistApp').controller(
    'ListController',
    function ($scope, $http, DebianBoxes) {

        $scope.distributions = [];
        $scope.boxes = [];

        $http
            .get('boxes/_distributions.json')
            .success(function(distributions, status, headers, config) {

                $scope.distributions = distributions;

                for(var i = 0; i < distributions.length; i++) {
                    var slug = distributions[i].slug;
                    $http
                        .get('boxes/' + slug + '.json')
                        .success(
                            (function(distribution){
                                return function(boxes, status, headers, config) {
                                    for(var i = 0; i < boxes.length; i++) {
                                        var box = boxes[i];
                                        box.distribution = distribution;
                                        $scope.boxes.push(box);
                                    }
                                }
                            }(distributions[i]))
                        );
                }
            });
    }
);
