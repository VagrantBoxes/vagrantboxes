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
         * Object of the form { debian: { name: "Debian", slug: "debian", show: true } }
         * @type {Object}
         */
        $scope.distributions = {};

        $scope.toggle_distro_visibility = function(slug) {
            $scope.distributions[slug].show = ! $scope.distributions[slug].show;
        };

        /************************************************************/
        // Architecture models & filters

        /**
         * Object of available architectures (32-bit, 64-bit, ...)
         * It has the form of { 32-bit: { name: "32-bit", show: true } }
         * @type {Object}
         */
        $scope.architectures = {};

        $scope.toggle_arch_visibility = function(arch) {
            $scope.architectures[arch].show = ! $scope.architectures[arch].show;
        };

        /************************************************************/
        // Provider models & filters

        /**
         * Object of available providers (VirtualBox, VMWare, ...)
         * It has the form of { VirtualBox: { name: "VirtualBox", show: true } }
         * @type {Object}
         */
        $scope.providers = {};

        $scope.toggle_provider_visibility = function(provider) {
            $scope.providers[provider].show = ! $scope.providers[provider].show;
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
         * Adds an architecture to the architectures object if it doesn't
         * exist yet. The architecture is flagged visible at the same time.
         * @param arch
         */
        var add_architecture = function(arch) {
            if(! $scope.architectures.hasOwnProperty(arch)) {
                $scope.architectures[arch] = { name: arch, show: true };
            }
        };

        /**
         * Adds a distribution to the distributions object if it doesn't
         * exist yet. The distribution is flagged visible at the same time.
         * @param distro
         */
        var add_distro = function(distro) {
            var slug = distro.slug;
            if(! $scope.distributions.hasOwnProperty(slug)) {
                $scope.distributions[slug] = distro;
                $scope.distributions[slug].show = true;
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
         * Adds a provider to the providers object if it doesn't
         * exist yet. The provider is flagged visible at the same time.
         * @param provider
         */
        var add_provider = function(provider) {
            if(! $scope.providers.hasOwnProperty(provider)) {
                $scope.providers[provider] = { name: provider, show: true };
            }
        };

        /**
         *
         * @param distro Distribution slug e.g. archlinux or debian
         * @param arch Architecture name e.g. 32-bit
         * @param provider Provider name e.g. VirtualBox
         * @returns {boolean}
         */
        $scope.isBoxVisible = function(distro, arch, provider) {
            return $scope.distributions[distro].show
                && $scope.architectures[arch].show
                && $scope.providers[provider].show;
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

                    add_distro(distributions[i]);

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
