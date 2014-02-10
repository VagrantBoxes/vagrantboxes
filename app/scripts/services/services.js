'use strict';

var services = angular.module('vagrantlistApp.services',
    ['ngResource']);

services.factory('BoxDistributions', function($q, $http) {

    var getDistros = function() {

        var deferred = $q.defer();

        $http
            .get('boxes/_distributions.json', {cache: true})
            .success(function(distributions, status, headers, config) {
                deferred.resolve(distributions);
            });

        return deferred.promise;
    };

    return {
        getDistros: getDistros
    };
});

services.factory('VagrantBoxes', function($q, $http, BoxDistributions) {

    var getBoxes = function() {

        // reference counter used to decide whether we should resolve
        // the deferred, this is needed since we do some asynchronous
        // ajax requests
        var processed = 0;

        // an array of all available boxes after all distributions
        // got processed
        var boxes = [];

        var deferred = $q.defer();

        // iterate over all the distributions and add the boxes of each
        // to the boxes array, we cache the data of the ajax requests
        // so that future executions of this block are much faster
        BoxDistributions.getDistros().then(function(distributions) {
            for(var i = 0; i < distributions.length; i++) {
                var slug = distributions[i].slug;
                $http
                    .get('boxes/' + slug + '.json', {cache: true})
                    .success(function(_boxes, status, headers, config) {
                        boxes = boxes.concat(_boxes);
                        processed++;
                        if(processed == distributions.length) {
                            deferred.resolve(boxes);
                        }
                    });
            }
        });

        return deferred.promise;
    };

    return {
        getBoxes: getBoxes
    };
});

services.factory('BoxArchitectures', function($q, $http, VagrantBoxes) {

    var getArchitectures = function() {

        // an array of all available architectures
        var architectures = [];

        var deferred = $q.defer();

        VagrantBoxes.getBoxes().then(function(boxes) {
            for(var i = 0; i < boxes.length; i++) {
                var box = boxes[i];
                if(-1 == architectures.indexOf(box.architecture)) {
                    architectures.push(box.architecture);
                }
                deferred.resolve(architectures);
            }
        });

        return deferred.promise;
    };

    return {
        getArchitectures: getArchitectures
    };
});

services.factory('BoxProviders', function($q, $http, VagrantBoxes) {

    var getProviders = function() {

        // an array of all available providers
        var providers = [];

        var deferred = $q.defer();

        VagrantBoxes.getBoxes().then(function(boxes) {
            for(var i = 0; i < boxes.length; i++) {
                var box = boxes[i];
                if(-1 == providers.indexOf(box.provider)) {
                    providers.push(box.provider);
                }
                deferred.resolve(providers);
            }
        });

        return deferred.promise;
    };

    return {
        getProviders: getProviders
    };
});

services.factory('BoxTemplate', function() {
    return {
        "name": "",
        "url": "",
        "architecture": "",
        "version": {
            "name": "",
            "number": ""
        },
        "provider": "",
        "size": "",
        "features": {
            "guest_additions": false,
            "vmware_tools": false,
            "puppet": false,
            "chef": false,
            "webserver": {
                "apache": false,
                "lighttpd": false,
                "nginx": false
            },
            "interpreters": {
                "ruby": false,
                "php": false,
                "python": false
            },
            "database": {
                "mysql": false,
                "mongodb": false
            },
            "vcs": {
                "git": false,
                "svn": false,
                "hg": false
            }
        },
        "source": "",
        "comment": ""
    };
});