'use strict';

angular.module('vagrantlistApp').controller(
    'SuggestController',
    function ($scope,
              BoxDistributions, VagrantBoxes, BoxArchitectures, BoxProviders) {

        $scope.distributions = {};
        $scope.architectures = {};
        $scope.providers = {};

        BoxArchitectures.getArchitectures().then(function(archs) {
            for(var i=0; i<archs.length; i++) {
                var arch = archs[i];
                $scope.architectures[arch] = {
                    name: arch,
                    show: false
                };
            }
        });

        BoxProviders.getProviders().then(function(providers) {
            for(var i=0; i<providers.length; i++) {
                var provider = providers[i];
                $scope.providers[provider] = {
                    name: provider,
                    show: false
                };
            }
        });

        BoxDistributions.getDistros().then(function(distributions) {
            for(var i=0; i<distributions.length; i++) {
                var slug = distributions[i].slug;
                $scope.distributions[slug] = distributions[i];
                $scope.distributions[slug].show = false;
            }
        });
    }
);
