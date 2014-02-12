'use strict';

angular.module('vagrantlistApp').controller(
    'ListController',
    function ($scope, $http, BoxDistributions, VagrantBoxes, BoxArchitectures, BoxProviders) {

        /**
         * An array with all the boxes fetched from the server
         * @type {Array}
         */
        $scope.boxes = [];

        /************************************************************/
        // Models

        /**
         * Object of the form { debian: { name: "Debian", slug: "debian", show: true } }
         * @type {Object}
         */
        $scope.distributions = {};

        /**
         * Object of available architectures (32-bit, 64-bit, ...)
         * It has the form of { 32-bit: { name: "32-bit", show: true } }
         * @type {Object}
         */
        $scope.architectures = {};

        /**
         * Object of available providers (VirtualBox, VMWare, ...)
         * It has the form of { VirtualBox: { name: "VirtualBox", show: true } }
         * @type {Object}
         */
        $scope.providers = {};

        /**
         * Stores the min/max values of the box sizes in the minmax
         * sub-object and the user-defined sizes in the minmax_show
         * sub-object to filter specific boxes.
         * @type {Object}
         */
        $scope.size = {
            floor: 0,
            ceil: 3000,
            min: 0,
            max: 0
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
         * @deprecated
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
         * Positions both sliders so that they match the exact range of
         * of the boxes' size.
         *
         * @param boxes
         */
        var adjust_slider_size_values = function(boxes) {

            var sizes = [];

            for(var i=0; i<boxes.length; i++) {
                sizes.push(parseInt(boxes[i].size));
            }

            $scope.size.min = Math.min.apply(Math, sizes);
            $scope.size.max = Math.max.apply(Math, sizes);
        }

        /**
         * Returns true if all of the show properties (for the distro,
         * arch, provider, ...) are true
         * @param distro Distribution slug e.g. archlinux or debian
         * @param arch Architecture name e.g. 32-bit
         * @param provider Provider name e.g. VirtualBox
         * @returns {boolean}
         */
        $scope.isBoxVisible = function(distro, arch, provider, size) {

            // we calculate the min/max values because we're not 100%
            // certain that slider will swapt the min/max attributes
            // dynamically
            var min = Math.min($scope.size.min, $scope.size.max);
            var max = Math.max($scope.size.min, $scope.size.max);

            return $scope.distributions[distro].show
                && $scope.architectures[arch].show
                && $scope.providers[provider].show
                && (min <= size && size <= max)
        };

        /************************************************************/
        // Now the controller is bootstrapped by populating all
        // necessary models and filters. First we fetch a list of
        // available distribitions and load them one after the other
        // afterwards.

        BoxDistributions.getDistros().then(function(distributions) {
            for(var i = 0; i < distributions.length; i++) {
                add_distro(distributions[i]);
            }
        });

        BoxArchitectures.getArchitectures().then(function(architectures) {
            for(var i = 0; i < architectures.length; i++) {
                add_architecture(architectures[i]);
            }
        });

        BoxProviders.getProviders().then(function(providers) {
            for(var i = 0; i < providers.length; i++) {
                add_provider(providers[i]);
            }
        });

        VagrantBoxes.getBoxes().then(function(boxes) {
            $scope.boxes = boxes;
            // passing the boxes by call by value can consume some
            // memory but this happens on the first page visit only
            adjust_slider_size_values(boxes);
        });
    }
);
