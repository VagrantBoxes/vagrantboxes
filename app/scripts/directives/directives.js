'use strict';

var directives = angular.module('vagrantlistApp.directives', []);

// the following directives are there for experiment purposes only
// in order to understand when a jquery plugin should be initialized
// which is not so obvious with
directives.directive('picker', function($compile, $timeout) {
    return function postLink(scope, iElement, iAttrs) {
//        jQuery(iElement).closest('select').selectpicker('refresh');
//        console.log(jQuery(iElement).closest('select'));
//        console.log('postlink');
        $timeout(function () {
            jQuery(iElement).closest('select').selectpicker('refresh');
        }, 200);
    }
    return {
        restrict : 'A',
        link: function(scope, element, attrs) {
            console.log('sp1 link');
        },
        compile : function(tele, tattr) {
            console.log("sp1 compile");
//            tele.selectpicker();
            return {
                pre : function(scope, iele, iattr) {
//                    console.log("sp1 compile pre");
                },
                post : function(scope, iele, iattr) {
//                    console.log("sp1 compile post");
//                    jQuery(iele).closest('select').selectpicker('refresh');
                    $timeout(function () {
                        jQuery(iele).closest('select').selectpicker('refresh');
                    }, 100);
                }
            };
        }
    };
});
