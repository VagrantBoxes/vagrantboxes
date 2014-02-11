'use strict';

var filters = angular.module('vagrantlistApp.filters', []);

filters.filter('bracesIfNotEmpty', function() {
    var filter = function(input) {
        var ret = '';
        if(0 != input.length) {
            ret = '(' + input + ')';
        }
        return ret;
    };

    return filter;
});

filters.filter('fileSize', function() {
    var filter = function(input) {
        var ret = '';
        if(parseInt(input) < 1000) {
            ret =  input + ' MB';
        } else {
            ret = '~' + input/1000 + ' GB'
        }
        return ret;
    };

    return filter;
});