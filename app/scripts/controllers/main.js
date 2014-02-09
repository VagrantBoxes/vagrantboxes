'use strict';

angular.module('vagrantlistApp').controller(
    'ListController',
    function ($scope, $http) {

        /**
         * An array with all the boxes fetched from the server
         * @type {Array}
         */
        $scope.boxes = [];

        /************************************************************/
        // Distribution models & filters

        /**
         * An array of objects of the form { "name": "Debian", "slug": "debian" }
         * @type {Array}
         */
        $scope.distributions = [];

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

        /************************************************************/
        // Architecture models & filters

        /**
         * Array of available architectures (32-bit, 64-bit, ...)
         * @type {Array}
         */
        $scope.architectures = [];

        /**
         * Boxes with these architectures should be displayed
         * while all the others are hidden.
         * @type {Array}
         */
        var architectures_show = [];

        /**
         * Returns true if the given arch is visible else false
         * @param arch
         * @returns {boolean}
         */
        $scope.isArchVisible = function(arch) {
            return -1 !== architectures_show.indexOf(arch);
        };

        $scope.toggle_arch_visibility = function(arch) {

            if($scope.isArchVisible(arch)) {
                var pos = architectures_show.indexOf(arch);
                architectures_show.splice(pos, 1);
            }
            else {
                architectures_show.push(arch);
            }
        };

        /************************************************************/
        // Provider models & filters

        /**
         * Array of available providers (VirtualBox, VMWare, ...)
         * @type {Array}
         */
        $scope.providers = [];

        /**
         * Boxes with these providers should be displayed
         * while all the others are hidden.
         * @type {Array}
         */
        var providers_show = [];

        /**
         * Returns true if the given provider is visible else false
         * @param provider
         * @returns {boolean}
         */
        $scope.isProviderVisible = function(provider) {
            return -1 !== providers_show.indexOf(provider);
        };

        $scope.toggle_provider_visibility = function(provider) {

            if($scope.isProviderVisible(provider)) {
                var pos = providers_show.indexOf(provider);
                providers_show.splice(pos, 1);
            }
            else {
                providers_show.push(provider);
            }
        };

        /************************************************************/
        // Size models & filters

        /**
         * Stores the min/max values of the box sizes in the minmax
         * sub-object and the user-defined sizes in the minmax_show
         * sub-object to filter specific boxes.
         * @type {Object}
         */
        $scope.size = {
            "minmax": {
                min: 0,
                max: 0
            },
            "minmax_show": {
                min: 0,
                max: 0
            }
        };

        /************************************************************/
        // Some helpers

        /**
         * Adds an architecture to the architecture array if it doesn't
         * exist yet. The architecture is flagged being visible at the
         * same time.
         * @param arch
         */
        var add_architecture = function(arch) {
            if(-1 == $scope.architectures.indexOf(arch)) {
                $scope.architectures.push(arch);
                architectures_show.push(arch);
            }
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

        /**
         * Adds a provider to the provider array if it doesn't
         * exist yet. The provider is flagged being visible at the
         * same time.
         * @param provider
         */
        var add_provider = function(provider) {
            if(-1 == $scope.providers.indexOf(provider)) {
                $scope.providers.push(provider);
                providers_show.push(provider);
            }
        };

        /************************************************************/
        // Now the controller is bootstrapped by populating all
        // necessary models and filters

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
                                        add_provider(boxes[i].provider);
                                    }
                                }
                            }(distributions[i]))
                        );
                }
            });
    }
);
