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
    var token = window.localStorage.getItem('token');
    if (token !== null) {
        $state.go('tabs.broadcast');
    }
    $scope.login = function(data) {
        $ionicLoading.show({
            templateUrl: "templates/loading.html"
        });
        AuthService.login(data.username, data.password).then(function(authenticated) {
            $scope.assets = authenticated;
            $scope.role = authenticated.roles[1];
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
                template: err.data.errDetails || ''
            });
        });
    };
}).controller('createNewUserCtrl', function($scope, $state, $ionicPopup, $ionicLoading, SignupService) {
    $scope.data = {};
    $scope.addUser = function(data) {
        $ionicLoading.show({
            templateUrl: "templates/loading.html"
        });
        SignupService.signup(data).then(function(authenticated) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Successfull',
                template: 'User added successfully!'
            });
        }, function(err) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Add User Failed!',
                template: err.data.errDetails || ''
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
        $scope.date = new Date(broadcastData.data.response.date)
    }, function(err) {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
            title: 'Update Broadcast Failed!',
            template: err.data.message
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
        $ionicLoading.show({
            templateUrl: "templates/loading.html"
        });
        DashboardService.like(messageId).then(function(likeCount) {
            $ionicLoading.hide();
            $state.go('tabs.broadcast', {}, {
                reload: true
            });
        }, function(err) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Like Failed!',
                template: err.data.message
            });
        });
    };
    $scope.refresh = function() {
        $state.go('tabs.broadcast', {}, {
            reload: true
        });
    };
    $scope.addComment = function(messagedata, channel) {
        $ionicPopup.prompt({
            title: 'Add Reply',
            inputType: 'text',
            inputPlaceholder: 'Please add Reply',
            maxLength: 50,
            okText: 'Post'
        }).then(function(res) {
            if (res) {
                $ionicLoading.show({
                    templateUrl: "templates/loading.html"
                });
                DashboardService.addComment(res, messagedata, channel).then(function(data) {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: 'Reply Posted',
                        template: 'Your reply posted successfuly'
                    });
                }, function(err) {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: 'Reply post Failed!',
                        template: err.data.message
                    });
                });
            }
        });
    };
    $scope.isGroupShown = function(messageThreadId) {
        return $scope.shownGroup === messageThreadId;
    };
    $scope.toggle = function(messageThreadId) {
        if ($scope.isGroupShown(messageThreadId)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = messageThreadId;
        }
    };
    $scope.getComment = function(messageThreadId) {
        if ($scope.isGroupShown(messageThreadId)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = messageThreadId;
        }
        $ionicLoading.show({
            templateUrl: "templates/loading.html"
        });
        DashboardService.getComments(messageThreadId).then(function(commentsData) {
            $ionicLoading.hide();
            $scope.commentsDatas = commentsData.data.response;
        }, function(err) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Get reply Failed!',
                template: err.data.message
            });
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
            template: err.data.message
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
        $ionicLoading.show({
            templateUrl: "templates/loading.html"
        });
        DashboardService.like(messageId).then(function(likeCount) {
            $ionicLoading.hide();
            $state.go('tabs.knowledge', {}, {
                reload: true
            });
        }, function(err) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Like Failed!',
                template: err.data.message
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
    $scope.addComment = function(messagedata, channel) {
        $ionicPopup.prompt({
            title: 'Add Reply',
            inputType: 'text',
            inputPlaceholder: 'Please add Reply',
            maxLength: 50,
            okText: 'Post'
        }).then(function(res) {
            if (res) {
                $ionicLoading.show({
                    templateUrl: "templates/loading.html"
                });
                DashboardService.addComment(res, messagedata, channel).then(function(data) {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: 'Reply Posted',
                        template: 'Your reply posted successfuly'
                    });
                }, function(err) {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: 'Reply Failed!',
                        template: err.data.message
                    });
                });
            }
        });
    };
    $scope.isGroupShown = function(messageThreadId) {
        return $scope.shownGroup === messageThreadId;
    };
    $scope.toggle = function(messageThreadId) {
        if ($scope.isGroupShown(messageThreadId)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = messageThreadId;
        }
    };
    $scope.getComment = function(messageThreadId) {
        if ($scope.isGroupShown(messageThreadId)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = messageThreadId;
        }
        $ionicLoading.show({
            templateUrl: "templates/loading.html"
        });
        DashboardService.getComments(messageThreadId).then(function(commentsData) {
            $ionicLoading.hide();
            $scope.commentsDatas = commentsData.data.response;
        }, function(err) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Get reply Failed!',
                template: err.data.message
            });
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
            template: err.data.message
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
        $ionicLoading.show({
            templateUrl: "templates/loading.html"
        });
        DashboardService.like(messageId).then(function(likeCount) {
            $ionicLoading.hide();
            $state.go('tabs.information', {}, {
                reload: true
            });
        }, function(err) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Like Failed!',
                template: err.data.message
            });
        });
    };
    $scope.refresh = function() {
        $state.go('tabs.information', {}, {
            reload: true
        });
    };
    $scope.addComment = function(messagedata, channel) {
        $ionicPopup.prompt({
            title: 'Add Reply',
            inputType: 'text',
            inputPlaceholder: 'Please add Reply',
            maxLength: 50,
            okText: 'Post'
        }).then(function(res) {
            if (res) {
                $ionicLoading.show({
                    templateUrl: "templates/loading.html"
                });
                DashboardService.addComment(res, messagedata, channel).then(function(data) {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: 'Reply Posted',
                        template: 'Your reply posted successfuly'
                    });
                }, function(err) {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: 'Reply Failed!',
                        template: err.data.message
                    });
                });
            }
        });
    };
    $scope.isGroupShown = function(messageThreadId) {
        return $scope.shownGroup === messageThreadId;
    };
    $scope.toggle = function(messageThreadId) {
        if ($scope.isGroupShown(messageThreadId)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = messageThreadId;
        }
    };
    $scope.getComment = function(messageThreadId) {
        if ($scope.isGroupShown(messageThreadId)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = messageThreadId;
        }
        $ionicLoading.show({
            templateUrl: "templates/loading.html"
        });
        DashboardService.getComments(messageThreadId).then(function(commentsData) {
            $ionicLoading.hide();
            $scope.commentsDatas = commentsData.data.response;
        }, function(err) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Get reply Failed!',
                template: err.data.message
            });
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
            template: err.data.message
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
        $ionicLoading.show({
            templateUrl: "templates/loading.html"
        });
        DashboardService.like(messageId).then(function(likeCount) {
            $ionicLoading.hide();
            $state.go('tabs.sos', {}, {
                reload: true
            });
        }, function(err) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Like Failed!',
                template: err.data.message
            });
        });
    };
    $scope.refresh = function() {
        $state.go('tabs.sos', {}, {
            reload: true
        });
    };
    $scope.addComment = function(messagedata, channel) {
        $ionicPopup.prompt({
            title: 'Add Reply',
            inputType: 'text',
            inputPlaceholder: 'Please add Reply',
            maxLength: 50,
            okText: 'Post'
        }).then(function(res) {
            if (res) {
                $ionicLoading.show({
                    templateUrl: "templates/loading.html"
                });
                DashboardService.addComment(res, messagedata, channel).then(function(data) {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: 'Reply Posted',
                        template: 'Your reply posted successfuly'
                    });
                }, function(err) {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: 'Reply Failed!',
                        template: err.data.message
                    });
                });
            }
        });
    };
    $scope.isGroupShown = function(messageThreadId) {
        return $scope.shownGroup === messageThreadId;
    };
    $scope.toggle = function(messageThreadId) {
        if ($scope.isGroupShown(messageThreadId)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = messageThreadId;
        }
    };
    $scope.getComment = function(messageThreadId) {
        if ($scope.isGroupShown(messageThreadId)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = messageThreadId;
        }
        $ionicLoading.show({
            templateUrl: "templates/loading.html"
        });
        DashboardService.getComments(messageThreadId).then(function(commentsData) {
            $ionicLoading.hide();
            $scope.commentsDatas = commentsData.data.response;
        }, function(err) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Get reply Failed!',
                template: err.data.message
            });
        });
    };
}).controller('profileCtrl', function($scope, $state, $ionicPopup, $ionicLoading, ProfileService) {
    $ionicLoading.show({
        templateUrl: "templates/loading.html"
    });
    ProfileService.fetchProfileDetials().then(function(profileData) {
        $ionicLoading.hide();
        $scope.userProfile = profileData.data.response;
    }, function(err) {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
            title: 'Get reply Failed!',
            template: err.data.message
        });
    });
    $scope.editPhone = function(data) {
        $ionicPopup.prompt({
            title: 'Edit Phone No',
            inputType: 'tel',
            inputPlaceholder: 'Enter your new mobile no',
            maxLength: 10
        }).then(function(res) {
            if (res) {
                $ionicLoading.show({
                    templateUrl: "templates/loading.html"
                });
                ProfileService.editPhone(res).then(function(authenticated) {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: 'Updated Successfull',
                        template: 'Your phone has been updated'
                    });
                    $state.go('profile', {}, {
                        reload: true
                    });
                }, function(err) {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: 'Update phone Failed!',
                        template: err.data.message
                    });
                });
            }
        });
    };
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
                template: 'Your role has been updated'
            });
        }, function(err) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Update Role Failed!',
                template: err.data.message
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
                template: 'Your Expertise has been updated'
            });
        }, function(err) {
            $ionicLoading.hide();
            console.log(JSON.stringify(err));
            var alertPopup = $ionicPopup.alert({
                title: 'Update Expertise Failed!',
                template: err.data.message
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
            if (searchedData !== undefined) {
                $scope.showFilter = true;
            }
            if (searchedData === undefined) {
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
                template: err.data.message
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
                template: err.data.message
            });
        });
    };
}).controller('changePasswordCtrl', function($scope, $state, $ionicLoading, $ionicPopup, AuthService) {
    $scope.changePassword = function(data) {
        $ionicLoading.show({
            templateUrl: "templates/loading.html"
        });
        AuthService.changePassword(data).then(function(postData) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Password Changed Successful!',
                template: 'Please login again'
            });
            AuthService.logout();
            $state.go('login');
        }, function(err) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Password Changed Failed!',
                template: err.data.message
            });
        });
    };
}).controller('creditsCtrl', function($scope) {}).controller('detailedPageCtrl', function($scope) {});