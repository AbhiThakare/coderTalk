angular.module('app').service('AuthService', function($q, $http, USER_ROLES, URL) {
    var LOCAL_TOKEN_KEY = 'yourTokenKey';
    var LOCAL_DATA = 'yourData';
    var TOKEN = 'token';
    var username = '';
    var isAuthenticated = false;
    var role = '';
    var authToken;

    function loadUserCredentials() {
        var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
        if (token) {
            var data = JSON.parse(window.localStorage.getItem(LOCAL_DATA));
            useCredentials(token, data);
        }
    }

    function storeUserCredentials(nameToken, data, token) {
        window.localStorage.setItem(LOCAL_TOKEN_KEY, nameToken);
        window.localStorage.setItem(LOCAL_DATA, JSON.stringify(data));
        window.localStorage.setItem(TOKEN, token);
        useCredentials(token, data);
    }

    function useCredentials(token, data) {
        var adminrole = (data.roles !== null && data.roles !== undefined) ? (data.roles.indexOf("ROLE_ADMIN")!== -1) ? true : false : false;
        var userrole = (data.roles !== null && data.roles !== undefined) ? (data.roles.indexOf("ROLE_USER")!== -1) ? true : false : false;
        var smerole = (data.roles !== null && data.roles !== undefined) ? (data.roles.indexOf("ROLE_SME")!== -1) ? true : false : false;
        role = (data.roles !== null && data.roles !== undefined) ? 'ROLE_USER' : 'ROLE_USER';
        isAuthenticated = true;
        authToken = token;
        if (adminrole) {
            role = USER_ROLES.admin;
        } else if (smerole) {
            role = USER_ROLES.sme;
        } else if (userrole) {
            role = USER_ROLES.public;
        }
    }

    function destroyUserCredentials() {
        authToken = undefined;
        username = '';
        isAuthenticated = false;
        window.localStorage.removeItem(LOCAL_TOKEN_KEY);
        window.localStorage.removeItem(TOKEN);
        window.localStorage.removeItem(LOCAL_DATA);
    }

    function getHeaderToken() {
        var LOCAL_TOKEN = 'token';
        var token = window.localStorage.getItem(LOCAL_TOKEN);
        return token;
    }

    function getAccessToken() {
        var LOCAL_DATA = 'yourData';
        var token = window.localStorage.getItem(LOCAL_DATA);
        return token;
    }
    var search = function(userData) {
        return $q(function(resolve, reject) {
            var req = {
                url: URL.url,
                method: 'GET',
                params: {
                    any: userData
                },
                headers: {
                    'Authorization': getHeaderToken()
                }
            }
            $http(req).then(function(data) {
                if (data.data.status == 'SUCCESS') {
                    resolve(data.data.response);
                } else {
                    reject('Search Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };
    var login = function(name, pw) {
        var token = 'Basic ' + window.btoa(name + ':' + pw);
        return $q(function(resolve, reject) {
            var req = {
                url: URL.url + "/authenticate",
                method: 'POST',
                headers: {
                    'Authorization': token
                },
                params: {
                    'email': name
                }
            }
            $http(req).then(function(data) {
                if (data.data.status == 'SUCCESS') {
                    storeUserCredentials(data.data.response.fname + '.yourServerToken', data.data.response, token);
                    resolve(data.data.response);
                } else {
                    reject('Login Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };
    var changePassword = function(userData) {
        var token = JSON.parse(getAccessToken());
        return $q(function(resolve, reject) {
            var req = {
                url: URL.url + token.email + "/pwd",
                method: 'PATCH',
                params: {
                    newPwd: userData.newPass
                },
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': getHeaderToken()
                }
            }
            $http(req).then(function(data) {
                if (data.data.status == 'SUCCESS') {
                    resolve(data.data.response);
                } else {
                    reject('Search Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };
    var logout = function() {
        destroyUserCredentials();
    };
    var isAuthorized = function(authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [
                authorizedRoles
            ];
        }
        return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
    };
    loadUserCredentials();
    return {
        login: login,
        logout: logout,
        isAuthorized: isAuthorized,
        search: search,
        changePassword: changePassword,
        isAuthenticated: function() {
            return isAuthenticated;
        },
        username: function() {
            return username;
        },
        role: function() {
            return role;
        }
    };
}).service('SignupService', function($q, $http, USER_ROLES, URL) {
    function getAccessToken() {
        var LOCAL_DATA = 'yourData';
        var token = window.localStorage.getItem(LOCAL_DATA);
        return token;
    }

    function getHeaderToken() {
        var LOCAL_TOKEN = 'token';
        var token = window.localStorage.getItem(LOCAL_TOKEN);
        return token;
    }
    var signup = function(userData) {
        var roles = [];
        (userData.value1 !== undefined) ? roles.push(userData.value1): '';
        (userData.value2 !== undefined) ? roles.push(userData.value2): '';
        (userData.value3 !== undefined) ? roles.push(userData.value3): '';
        if (userData.value1 === undefined && userData.value2 === undefined && userData.value3 === undefined) {
            roles.push('user');
        }
        return $q(function(resolve, reject) {
            var req = {
                url: 'http://169.44.124.140:8091/codertalk/user',
                method: 'PUT',
                data: {
                    "fname": userData.fname,
                    "lname": userData.lname,
                    "email": userData.email,
                    "phone": userData.phoneNo,
                    "pwd": userData.password,
                    "roles": roles,
                    "aoe": []
                },
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            }
            $http(req).then(function(data) {
                if (data.data.status == 'SUCCESS') {
                    resolve(data);
                } else {
                    reject('Signin Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };
    var addUser = function(userData) {
        return $q(function(resolve, reject) {
            var token = JSON.parse(getAccessToken());
            var req = {
                url: URL.url,
                method: 'PATCH',
                data: {
                    "fname": userData.fname,
                    "lname": userData.lname,
                    "email": userData.email,
                    "phone": userData.phoneNo,
                    "roles": ["admin", "user", "sme"],
                    "aoe": []
                },
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': getHeaderToken()
                }
            }
            $http(req).then(function(data) {
                if (data.data.status == 'SUCCESS') {
                    resolve(data);
                } else {
                    reject('Add User Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };
    var changeRole = function(userData) {
        var token = JSON.parse(getAccessToken());
        return $q(function(resolve, reject) {
            var req = {
                url: URL.url + userData.email + "/role/" + userData.role + "",
                method: 'PATCH',
                data: {
                    "accessToken": token.accessToken,
                    "email": token.email
                },
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': getHeaderToken()
                }
            }
            $http(req).then(function(data) {
                if (data.data.status == 'SUCCESS') {
                    resolve(data);
                } else {
                    reject('Update Role Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };
    var addExpertise = function(userData) {
        return $q(function(resolve, reject) {
            var token = JSON.parse(getAccessToken());
            var req = {
                url: URL.url + userData.email + "/expertise/" + userData.expertise + "",
                method: 'PATCH',
                data: {
                    "accessToken": token.accessToken,
                    "email": token.email
                },
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': getHeaderToken()
                }
            }
            $http(req).then(function(data) {
                console.log(data);
                if (data.data.status == 'SUCCESS') {
                    resolve(data);
                } else {
                    reject('Update Expertise Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };
    return {
        signup: signup,
        addUser: addUser,
        changeRole: changeRole,
        addExpertise: addExpertise
    };
}).service('DashboardService', function($q, $http, $filter, USER_ROLES, URL) {
    var today = $filter('date')(new Date(), 'yyyy-MM-dd');

    function getAccessToken() {
        var LOCAL_DATA = 'yourData';
        var token = window.localStorage.getItem(LOCAL_DATA);
        return token;
    }

    function getHeaderToken() {
        var LOCAL_TOKEN = 'token';
        var token = window.localStorage.getItem(LOCAL_TOKEN);
        return token;
    }
    var getComments = function(messageThreadId) {
        return $q(function(resolve, reject) {
            var comments = [];
            var req = {
                url: URL.urlChannels + "messages/thread/" + messageThreadId,
                method: 'GET',
                headers: {
                    'Authorization': getHeaderToken(),
                    'Content-Type': 'application/json;charset=UTF-8',
                    'page': 0
                }
            }
            $http(req).then(function(data) {
                if (data.data.status === 'SUCCESS') {
                    resolve(data);
                } else {
                    reject('Get Comment Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };
    var addComment = function(message, messagedata, channel) {
        return $q(function(resolve, reject) {
            var comments = [];
            var token = JSON.parse(getAccessToken());
            var req = {
                url: URL.urlChannels + channel + "/message/" + messagedata.uuid + "/reply",
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getHeaderToken()
                },
                data: {
                    "title": messagedata.title,
                    "message": message,
                    "likes": messagedata.likes,
                    "author": token.email,
                    "date": today + 'T24:00:00.000+0530'
                }
            }
            $http(req).then(function(data) {
                if (data.data.status == 'SUCCESS') {
                    resolve(data);
                } else {
                    reject('Add replies Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };
    var broadcast = function() {
        return $q(function(resolve, reject) {
            var comments = [];
            var req = {
                url: URL.urlChannels + "broadcast/messages",
                method: 'GET',
                headers: {
                    'Authorization': getHeaderToken(),
                    'fromDate': '2016-08-01T00:00:00.000+0530',
                    'toDate': today + 'T24:00:00.000+0530',
                    'page': 0
                }
            }
            $http(req).then(function(data) {
                if (data.data.status == 'SUCCESS') {
                    resolve(data);
                } else {
                    reject('Update Role Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };
    var information = function() {
        return $q(function(resolve, reject) {
            var req = {
                url: URL.urlChannels + "information/messages",
                method: 'GET',
                headers: {
                    'Authorization': getHeaderToken(),
                    'fromDate': '2016-08-01T00:00:00.000+0530',
                    'toDate': today + 'T24:00:00.000+0530',
                    'page': 0
                }
            }
            $http(req).then(function(data) {
                if (data.data.status == 'SUCCESS') {
                    resolve(data);
                } else {
                    reject('Update Role Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };
    var knowledge = function() {
        return $q(function(resolve, reject) {
            var req = {
                url: URL.urlChannels + "knowledge/messages",
                method: 'GET',
                headers: {
                    'Authorization': getHeaderToken(),
                    'fromDate': '2016-08-01T00:00:00.000+0530',
                    'toDate': today + 'T24:00:00.000+0530',
                    'page': 0
                }
            }
            $http(req).then(function(data) {
                if (data.data.status == 'SUCCESS') {
                    resolve(data);
                } else {
                    reject('Update Role Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };
    var sos = function() {
        return $q(function(resolve, reject) {
            var req = {
                url: URL.urlChannels + "sos/messages",
                method: 'GET',
                headers: {
                    'Authorization': getHeaderToken(),
                    'fromDate': '2016-08-01T00:00:00.000+0530',
                    'toDate': today + 'T24:00:00.000+0530',
                    'page': 0
                }
            }
            $http(req).then(function(data) {
                if (data.data.status == 'SUCCESS') {
                    resolve(data);
                } else {
                    reject('Update Role Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };
    var like = function(messageId) {
        return $q(function(resolve, reject) {
            var req = {
                url: URL.urlChannels + "messages/" + messageId + "/like",
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': getHeaderToken(),
                }
            }
            $http(req).then(function(data) {
                if (data.data.status == 'SUCCESS') {
                    resolve(data);
                } else {
                    reject('Like Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };
    var postMessage = function(data) {
        return $q(function(resolve, reject) {
            var token = JSON.parse(getAccessToken());
            var req = {
                url: URL.urlChannels + data.channels + "/message",
                method: 'PUT',
                data: {
                    "title": data.subject,
                    "message": data.message,
                    "likes": 1,
                    "author": token.email,
                    "date": today + "T00:00:00Z",
                    "tags": ["java", "javascript"]
                },
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': getHeaderToken(),
                }
            }
            $http(req).then(function(data) {
                if (data.data.status == 'SUCCESS') {
                    resolve(data);
                } else {
                    reject('Post Message Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };
    return {
        broadcast: broadcast,
        information: information,
        knowledge: knowledge,
        sos: sos,
        postMessage: postMessage,
        like: like,
        getComments: getComments,
        addComment: addComment
    };
}).factory('ProfileService', function($q, $http, USER_ROLES, URL) {
    function getAccessToken() {
        var LOCAL_DATA = 'yourData';
        var token = window.localStorage.getItem(LOCAL_DATA);
        return token;
    }

    function getHeaderToken() {
        var LOCAL_TOKEN = 'token';
        var token = window.localStorage.getItem(LOCAL_TOKEN);
        return token;
    }
    var getData = function() {
        var LOCAL_DATA = 'yourData';
        var token = window.localStorage.getItem(LOCAL_DATA);
        return token;
    };
    var fetchProfileDetials = function() {
        return $q(function(resolve, reject) {
            var data = JSON.parse(getData());
            var token = JSON.parse(getAccessToken());
            var req = {
                url: URL.url + data.email + "/",
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': getHeaderToken(),
                }
            }
            $http(req).then(function(data) {
                if (data.data.status == 'SUCCESS') {
                    resolve(data);
                } else {
                    reject('Post Message Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };
    var editPhone = function(phoneNo) {
        return $q(function(resolve, reject) {
            var token = JSON.parse(getData());
            var req = {
                url: URL.url + token.email + "/phone/" + phoneNo,
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': getHeaderToken(),
                }
            }
            $http(req).then(function(data) {
                if (data.data.status == 'SUCCESS') {
                    resolve(data);
                } else {
                    reject('Update phone Failed!');
                }
            }, function(err) {
                reject(err);
            });
        });
    };
    return {
        getData: getData,
        editPhone: editPhone,
        fetchProfileDetials: fetchProfileDetials
    };
}).factory('AuthInterceptor', function($rootScope, $q, AUTH_EVENTS) {
    return {
        responseError: function(response) {
            $rootScope.$broadcast({
                401: AUTH_EVENTS.notAuthenticated,
                403: AUTH_EVENTS.notAuthorized
            }[response.status], response);
            return $q.reject(response);
        }
    };
}).config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
});