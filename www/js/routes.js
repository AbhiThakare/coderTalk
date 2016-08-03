angular.module('app').config(function($stateProvider, $urlRouterProvider, USER_ROLES) {
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider.state('tabs.broadcast', {
        url: '/page2',
        cache: false,
        views: {
            'tab1': {
                templateUrl: 'templates/broadcast.html',
                controller: 'broadcastCtrl'
            }
        }
    }).state('tabs.knowledge', {
        url: '/page3',
        cache: false,
        views: {
            'tab2': {
                templateUrl: 'templates/knowledge.html',
                controller: 'knowledgeCtrl'
            }
        }
    }).state('tabs.information', {
        url: '/page4',
        cache: false,
        views: {
            'tab3': {
                templateUrl: 'templates/information.html',
                controller: 'informationCtrl'
            }
        }
    }).state('tabs.sos', {
        url: '/page5',
        cache: false,
        views: {
            'tab4': {
                templateUrl: 'templates/sos.html',
                controller: 'sosCtrl'
            }
        }
    }).state('profile', {
        url: '/page6',
        cache: false,
        templateUrl: 'templates/profile.html',
        controller: 'profileCtrl'
    }).state('logout', {
        cache: false,
        controller: 'logoutCtrl'
    }).state('createNewUser', {
        url: '/page9',
        templateUrl: 'templates/createNewUser.html',
        controller: 'createNewUserCtrl',
        data: {
            authorizedRoles: [USER_ROLES.admin]
        }
    }).state('changeRole', {
        url: '/page10',
        templateUrl: 'templates/changeRole.html',
        controller: 'changeRoleCtrl',
        data: {
            authorizedRoles: [USER_ROLES.admin]
        }
    }).state('changePassword', {
        url: '/page15',
        templateUrl: 'templates/changePassword.html',
        controller: 'changePasswordCtrl'
    }).state('addNewItem', {
        url: '/page18',
        templateUrl: 'templates/addNewItem.html',
        controller: 'adddNewItemCtrl'
    }).state('addExpertise', {
        url: '/page11',
        templateUrl: 'templates/addExpertise.html',
        controller: 'addExpertiseCtrl'
    }).state('searchUser', {
        url: '/page12',
        templateUrl: 'templates/searchUser.html',
        controller: 'searchUserCtrl'
    }).state('credits', {
        url: '/page14',
        templateUrl: 'templates/credits.html',
        controller: 'creditsCtrl'
    }).state('tabs.detailedPage', {
        url: '/page8',
        views: {
            'tab1': {
                templateUrl: 'templates/detailedPage.html',
                controller: 'detailedPageCtrl'
            }
        }
    }).state('tabs', {
        url: '/page1',
        templateUrl: 'templates/tabs.html',
        abstract: true
    }).state('login', {
        url: '/page16',
        abstract: false,
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
    }).state('signup', {
        url: '/signup',
        abstract: false,
        templateUrl: 'templates/signup.html',
        controller: 'signupCtrl'
    })
    $urlRouterProvider.otherwise('/page16')
});