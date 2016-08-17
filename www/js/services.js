angular.module('app').service('AuthService', function($q, $http, USER_ROLES) {
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
            var data = window.localStorage.getItem(LOCAL_DATA);
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
        role = (data.roles !== null && data.roles !== undefined) ? data.roles[0] : 'user';
        isAuthenticated = true;
        authToken = token;
        if (role == 'admin') {
            role = USER_ROLES.admin;
        }
        if (role == 'user') {
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
    var search = function(userData) {
        return $q(function(resolve, reject) {
            var req = {
                url: "http://inmbz2239.in.dst.ibm.com:8091/codertalk/user",
                method: 'GET',
                params: {
                    any: userData
                },
                headers: {
                    'Authorization':getHeaderToken()
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
    	var token = 'Basic '+window.btoa(name+':'+pw);
        return $q(function(resolve, reject) {
            var req = {
                url: "http://inmbz2239.in.dst.ibm.com:8091/codertalk/user/authenticate",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': token
                },
                params: {'email': name}
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
    var logout = function() {
        destroyUserCredentials();
    };
    var isAuthorized = function(authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }
        return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
    };
    loadUserCredentials();
    return {
        login: login,
        logout: logout,
        isAuthorized: isAuthorized,
        search: search,
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
}).service('SignupService', function($q, $http, USER_ROLES) {
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
        return $q(function(resolve, reject) {
            var req = {
                url: "http://inmbz2239.in.dst.ibm.com:8091/codertalk/user",
                method: 'PUT',
                data: {
                    "fname": userData.fname,
                    "lname": userData.lname,
                    "email": userData.email,
                    "phone": userData.phoneNo,
                    "pwd": userData.password,
                    "roles": ["admin", "user", "sme"],
                    "aoe": ["javascript", "mca-ui"]
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
                url: "http://inmbz2239.in.dst.ibm.com:8091/codertalk/user/",
                method: 'PATCH',
                data: {
                	"fname": userData.fname,
                    "lname": userData.lname,
                    "email": userData.email,
                    "phone": userData.phoneNo,
                    "roles": ["admin", "user", "sme"],
                    "aoe": ["javascript", "mca-ui"]
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
                url: "http://inmbz2239.in.dst.ibm.com:8091/codertalk/user" + userData.email + "/role/" + userData.role + "",
                method: 'PATCH',
                data: {
                    "accessToken": token.accessToken,
                    "email": token.email
                },
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization':getHeaderToken()
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
                url: "http://inmbz2239.in.dst.ibm.com:8091/codertalk/user/" + userData.email + "/expertise/" + userData.expertise + "",
                method: 'PATCH',
                data: {
                    "accessToken": token.accessToken,
                    "email": token.email
                },
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization':getHeaderToken()
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
}).service('DashboardService', function($q, $http, USER_ROLES) {
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
    var broadcast = function() {
        return $q(function(resolve, reject) {
            var req = {
                url: "http://inmbz2239.in.dst.ibm.com:8091/codertalk/channels/broadcast/messages",
                method: 'GET',
                headers: {
                    'Authorization':getHeaderToken(),
                    'fromDate':'2016-08-01T00:00:00.000+0530',
                    'toDate':'2016-08-11T00:00:00.000+0530',
                    'page':0
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
                url: "http://inmbz2239.in.dst.ibm.com:8091/codertalk/channels/information/messages",
                method: 'GET',
                headers: {
                    'Authorization':getHeaderToken(),
                    'fromDate':'2016-08-01T00:00:00.000+0530',
                    'toDate':'2016-08-11T00:00:00.000+0530',
                    'page':0
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
                url: "http://inmbz2239.in.dst.ibm.com:8091/codertalk/channels/knowledge/messages",
                method: 'GET',
                headers: {
                    'Authorization':getHeaderToken(),
                    'fromDate':'2016-08-01T00:00:00.000+0530',
                    'toDate':'2016-08-11T00:00:00.000+0530',
                    'page':0
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
                url: "http://inmbz2239.in.dst.ibm.com:8091/codertalk/channels/sos/messages",
                method: 'GET',
                headers: {
                    'Authorization':getHeaderToken(),
                    'fromDate':'2016-08-01T00:00:00.000+0530',
                    'toDate':'2016-08-11T00:00:00.000+0530',
                    'page':0
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
                url: "http://inmbz2239.in.dst.ibm.com:8091/codertalk/channels/messages/" + messageId + "/like",
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization':getHeaderToken(),
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
                url: "http://inmbz2239.in.dst.ibm.com:8091/codertalk/channels/" + data.channels + "/message",
                method: 'PUT',
                data: {
                	"title":data.subject,
                    "message":data.message,
                    "likes":1,
                    "author": token.email,
                    "date":"2016-04-15T00:00:00Z",
                    "tags": ["java", "javascript"]
                },
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization':getHeaderToken(),
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
        like: like
    };
}).factory('ProfileService', function() {
    var getData = function() {
        var LOCAL_DATA = 'yourData';
        var token = window.localStorage.getItem(LOCAL_DATA);
        return token;
    };
    return {
        getData: getData
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