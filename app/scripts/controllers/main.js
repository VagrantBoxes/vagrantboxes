'use strict';

angular.module('vagrantlistApp').controller(
    'ListController',
    function ($scope, $http) {

        /**
         * An array of objects of the form { "name": "Debian", "slug": "debian" }
         * @type {Array}
         */
        $scope.distributions = [];

        /**
         * Array of available architectures (32-bit, 64-bit, ...)
         * @type {Array}
         */
        $scope.architectures = [];
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
         * Returns true if the distro with the given slug is visible
         * else false
         * @param slug
         * @returns {boolean}
         */
        $scope.isDistroVisible = function(slug) {
            return -1 !== distributions_slug_show.indexOf(slug);
        };

        $scope.toggle_distro_visibility = function(slug) {
            if($scope.isDistroVisible(slug)) {
                var pos = distributions_slug_show.indexOf(slug);
                distributions_slug_show.splice(pos, 1);
            }
            else {
                distributions_slug_show.push(slug);
            }
        };

        /**
         * Adds an architecture to the architecture array if it doesn't
         * exist yet.
         * @param arch
         */
        var add_architecture = function(arch) {
            if(-1 == $scope.architectures.indexOf(arch))
                $scope.architectures.push(arch);
        };

        /**
         * Merges the distro information into the box object and adds
         * it to the box array.
         * @param distro
         * @param box
         */
        var add_box = function(distro, box) {
            box.distribution = distro;
            $scope.boxes.push(box);
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
                                        add_box(distribution, boxes[i]);
                                        add_architecture(boxes[i].architecture);
                                    }
                                }
                            }(distributions[i]))
                        );
                }
            });
    }
);
