// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('app', ['ionic', 'ngResource', 'ngCordova', 'ionic-material', 'ionMdInput']).run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
}).run(function($rootScope, $state, $ionicPopup, AuthService, AUTH_EVENTS, $cordovaPush) {
    $rootScope.$on('$stateChangeStart', function(event, next, nextParams, fromState) {
        if ('data' in next && 'authorizedRoles' in next.data) {
            var authorizedRoles = next.data.authorizedRoles;
            if (!AuthService.isAuthorized(authorizedRoles)) {
                event.preventDefault();
                var alertPopup = $ionicPopup.alert({
                    title: 'Unauthorized!',
                    template: 'You are not allowed to access this resource.'
                });
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                $state.go($state.current, {}, {
                    reload: true
                });
            }
        }
        if (!AuthService.isAuthenticated() && next.name !== 'signup') {
            if (next.name !== 'login') {
                event.preventDefault();
                $state.go('login');
            }
        }
    });
}).directive("passwordVerify", function() {
    return {
        require: "ngModel",
        scope: {
            passwordVerify: '='
        },
        link: function(scope, element, attrs, ctrl) {
            scope.$watch(function() {
                var combined;
                if (scope.passwordVerify || ctrl.$viewValue) {
                    combined = scope.passwordVerify + '_' + ctrl.$viewValue;
                }
                return combined;
            }, function(value) {
                if (value) {
                    ctrl.$parsers.unshift(function(viewValue) {
                        var origin = scope.passwordVerify;
                        if (origin !== viewValue) {
                            ctrl.$setValidity("passwordVerify", false);
                            return undefined;
                        } else {
                            ctrl.$setValidity("passwordVerify", true);
                            return viewValue;
                        }
                    });
                }
            });
        }
    };
});