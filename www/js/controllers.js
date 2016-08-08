angular.module('app').controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
    $scope.username = AuthService.username();
    $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
        var alertPopup = $ionicPopup.alert({
            title: 'Unauthorized!',
            template: 'You are not allowed to access this resource.'
        });
    });
    $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
        AuthService.logout();
        $state.go('login');
        var alertPopup = $ionicPopup.alert({
            title: 'Session Lost!',
            template: 'Sorry, You have to login again.'
        });
    });
}).controller('loginCtrl', function($scope, $state, $ionicPopup, $ionicLoading, AuthService) {
    $scope.data = {};
    $scope.login = function(data) {
        $ionicLoading.show({
            templateUrl: "templates/loading.html"
        });
        AuthService.login(data.username, data.password).then(function(authenticated) {
            $scope.assets = authenticated;
            $ionicLoading.hide();
            $state.go('tabs.broadcast', {}, {
                reload: true
            });
        }, function(err) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
    };
}).controller('signupCtrl', function($scope, $state, $ionicPopup, $ionicLoading, SignupService) {
    $scope.data = {};
    $scope.signup = function(data) {
        $ionicLoading.show({
            templateUrl: "templates/loading.html"
        });
        SignupService.signup(data).then(function(authenticated) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Signup Successfull',
                template: 'You can now login!'
            });
            $state.go('login', {}, {
                reload: true
            });
        }, function(err) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Signup Failed!',
                template: 'There was some problem with server.'
            });
        });
    };
}).controller('createNewUserCtrl', function($scope, $state, $ionicPopup, $ionicLoading, SignupService) {
    $scope.data = {};
    $scope.addUser = function(data) {
        $ionicLoading.show({
            templateUrl: "templates/loading.html"
        });
        SignupService.addUser(data).then(function(authenticated) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Signup Successfull',
                template: 'You can now login!'
            });
        }, function(err) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Add User Failed!',
                template: 'There was some problem with server.'
            });
        });
    };
}).controller('logoutCtrl', function($scope, $state, $ionicPopup, AuthService) {
    AuthService.logout();
    $state.go('login');
}).controller('broadcastCtrl', function($scope, $state, $ionicLoading, $ionicPopup, DashboardService, AuthService) {
    $ionicLoading.show({
        templateUrl: "templates/loading.html"
    });
    DashboardService.broadcast().then(function(broadcastData) {
        $ionicLoading.hide();
        $scope.broadcastDatas = broadcastData.data.response;
    }, function(err) {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
            title: 'Update Broadcast Failed!',
            template: 'There was some problem with server.'
        });
    });
    $scope.logout = function() {
        AuthService.logout();
        $state.go('login');
    };
    $scope.search = function() {
        $state.go('searchUser');
    };
    $scope.like = function(messageId) {
        DashboardService.like(messageId).then(function(likeCount) {
            $ionicLoading.hide();
            $state.go('tabs.broadcast', {}, {
                reload: true
            });
        }, function(err) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Like Failed!',
                template: 'There was some problem with server.'
            });
        });
    };
    $scope.refresh = function() {
        $state.go('tabs.broadcast', {}, {
            reload: true
        });
    };
}).controller('knowledgeCtrl', function($scope, $state, $ionicLoading, $ionicPopup, DashboardService, AuthService) {
    $ionicLoading.show({
        templateUrl: "templates/loading.html"
    });
    DashboardService.knowledge().then(function(knowedgeData) {
        $ionicLoading.hide();
        $scope.knowedgeDatas = knowedgeData.data.response;
    }, function(err) {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
            title: 'Update Knowedge Failed!',
            template: 'There was some problem with server.'
        });
    });
    $scope.logout = function() {
        AuthService.logout();
        $state.go('login');
    };
    $scope.search = function() {
        $state.go('searchUser');
    };
    $scope.like = function(messageId) {
        DashboardService.like(messageId).then(function(likeCount) {
            $ionicLoading.hide();
            $state.go('tabs.knowledge', {}, {
                reload: true
            });
        }, function(err) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Like Failed!',
                template: 'There was some problem with server.'
            });
        });
    };
    $scope.refresh = function() {
        $state.go('tabs.knowledge', {}, {
            reload: true
        });
    };
    $scope.add = function() {
        $state.go('signup', {}, {
            reload: true
        });
    };
}).controller('informationCtrl', function($scope, $state, $ionicLoading, $ionicPopup, DashboardService, AuthService) {
    $ionicLoading.show({
        templateUrl: "templates/loading.html"
    });
    DashboardService.information().then(function(informationData) {
        $ionicLoading.hide();
        $scope.informationDatas = informationData.data.response;
    }, function(err) {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
            title: 'Update Information Failed!',
            template: 'There was some problem with server.'
        });
    });
    $scope.logout = function() {
        AuthService.logout();
        $state.go('login');
    };
    $scope.search = function() {
        $state.go('searchUser');
    };
    $scope.like = function(messageId) {
        DashboardService.like(messageId).then(function(likeCount) {
            $ionicLoading.hide();
            $state.go('tabs.information', {}, {
                reload: true
            });
        }, function(err) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Like Failed!',
                template: 'There was some problem with server.'
            });
        });
    };
    $scope.refresh = function() {
        $state.go('tabs.information', {}, {
            reload: true
        });
    };
}).controller('sosCtrl', function($scope, $state, $ionicLoading, $ionicPopup, DashboardService, AuthService) {
    $ionicLoading.show({
        templateUrl: "templates/loading.html"
    });
    DashboardService.sos().then(function(sosData) {
        $ionicLoading.hide();
        $scope.sosDatas = sosData.data.response;
    }, function(err) {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
            title: 'Update SOS Failed!',
            template: 'There was some problem with server.'
        });
    });
    $scope.logout = function() {
        AuthService.logout();
        $state.go('login');
    };
    $scope.search = function() {
        $state.go('searchUser');
    };
    $scope.like = function(messageId) {
        DashboardService.like(messageId).then(function(likeCount) {
            $ionicLoading.hide();
            $state.go('tabs.sos', {}, {
                reload: true
            });
        }, function(err) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Like Failed!',
                template: 'There was some problem with server.'
            });
        });
    };
    $scope.refresh = function() {
        $state.go('tabs.sos', {}, {
            reload: true
        });
    };
}).controller('profileCtrl', function($scope, $state, $ionicPopup, ProfileService) {
    $scope.userProfile = JSON.parse(ProfileService.getData());
}).controller('changeRoleCtrl', function($scope, $state, $ionicPopup, $ionicLoading, SignupService) {
    $scope.data = {};
    $scope.changeRole = function(data) {
        $ionicLoading.show({
            templateUrl: "templates/loading.html"
        });
        SignupService.changeRole(data).then(function(authenticated) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Updated Successfull',
                template: 'Your role hase been updated'
            });
        }, function(err) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Update Role Failed!',
                template: 'There was some problem with server.'
            });
        });
    };
}).controller('addExpertiseCtrl', function($scope, $state, $ionicPopup, $ionicLoading, SignupService, ProfileService) {
    $scope.data = {};
    $scope.addExpertise = function(data) {
        $ionicLoading.show({
            templateUrl: "templates/loading.html"
        });
        SignupService.addExpertise(data).then(function(authenticated) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Expertise Added Successfull',
                template: 'Your Expertise hase been updated'
            });
        }, function(err) {
            $ionicLoading.hide();
            console.log(JSON.stringify(err));
            var alertPopup = $ionicPopup.alert({
                title: 'Update Expertise Failed!',
                template: 'There was some problem with server.'
            });
        });
    };
}).controller('searchUserCtrl', function($scope, $state, $ionicPopup, $ionicLoading, AuthService) {
    $scope.search = function(data) {
        $ionicLoading.show({
            templateUrl: "templates/loading.html"
        });
        AuthService.search(data).then(function(searchedData) {
            $ionicLoading.hide();
            $scope.showFilter = false;
            if (searchedData !== null) {
                $scope.showFilter = true;
            }
            if (searchedData === null) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Search Failed!',
                    template: 'No result found!'
                });
            }
            $scope.userProfiles = searchedData;
        }, function(err) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Search Failed!',
                template: 'There was some problem with server.'
            });
        });
    };
}).controller('adddNewItemCtrl', function($scope, $state, $ionicLoading, $ionicPopup, DashboardService) {
    $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
        viewData.enableBack = true;
    });
    $scope.postMessage = function(data) {
        $ionicLoading.show({
            templateUrl: "templates/loading.html"
        });
        DashboardService.postMessage(data).then(function(postData) {
            $ionicLoading.hide();
            $scope.messageDatas = postData.data.response;
            var alertPopup = $ionicPopup.alert({
                title: 'Post Message Successful!',
                template: 'Your Message added and open for every one to read!'
            });
            $state.go('tabs.broadcast');
        }, function(err) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Post Message Failed!',
                template: 'There was some problem with server.'
            });
        });
    };
}).controller('changePasswordCtrl', function($scope) {}).controller('creditsCtrl', function($scope) {}).controller('detailedPageCtrl', function($scope) {});