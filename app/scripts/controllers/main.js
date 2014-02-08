'use strict';

angular.module('vagrantlistApp').controller(
    'ListController',
    function ($scope, $http, DebianBoxes) {

        /**
         * An array of objects of the form { "name": "Debian", "slug": "debian" }
         * @type {Array}
         */
        $scope.distributions = [];

        /**
         * An array with all the boxes fetched from the server
         * @type {Array}
         */
        $scope.boxes = [];

        /**
         * Distributions that should be displayed
         * @type {Array}
         */
        var distributions_slug_show = [];

        /**
         * Handler for the ng-show attribute on a box row
         * @param slug
         * @returns {boolean}
         */
        $scope.show = function(slug) {
            return -1 !== distributions_slug_show.indexOf(slug);
        };

        $http
            .get('boxes/_distributions.json')
            .success(function(distributions, status, headers, config) {

                $scope.distributions = distributions;

                for(var i = 0; i < distributions.length; i++) {

                    var slug = distributions[i].slug;

                    // initially every distro will be shown
                    distributions_slug_show.push(slug);

                    // now populate the boxes array while the distribtion
                    // information will be merged into the jsons returned
                    // by the server
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
