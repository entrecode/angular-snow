/**
 * Created by felix on 01.12.15.
 */
/**
 * Created by felix on 01.12.15.
 */
'use strict';
angular.module('angular-snow', []).directive('ngSnow', function($timeout) {
  return {
    scope:      {
      ngSnow:      '=',
      customFlake: '@'
    },
    restrict:   'A',
    replace:    true,
    transclude: true,
    template:   '<div class="angular-snow" ng-show="ngSnow" ng-style="{\'background-image\':background}"><ng-transclude></ng-transclude></div>',
    link:       function(scope, el, attrs) {
      var defaultFlake = "url('http://www.wearewebstars.dk/codepen/img/s1.png'), url('http://www.wearewebstars.dk/codepen/img//s2.png'), url('http://www.wearewebstars.dk/codepen/img//s3.png');"
      scope.background = scope.customFlake ? 'url(' + scope.customFlake + ')' : defaultFlake;
      console.debug('Let it snow!');
    }
  };
});