'use strict';

angular.module('vagrantlistApp').controller(
    'SuggestController',
    function ($scope,
              BoxDistributions, VagrantBoxes, BoxArchitectures, BoxProviders) {

        $scope.distributions = {};

        BoxArchitectures.getArchitectures().then(function(archs) {
            // TODO: provide radio buttons and a text field for another arch
            //console.log(archs);
        });

        BoxProviders.getProviders().then(function(providers) {
            // TODO: provide radio buttons and a text field for another provider
            //console.log(providers);
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
