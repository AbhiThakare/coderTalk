angular.module('app')

.service('AuthService', function($q, $http, USER_ROLES) {
  var LOCAL_TOKEN_KEY = 'yourTokenKey';
  var LOCAL_DATA = 'yourData';
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

  function storeUserCredentials(token, data) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    window.localStorage.setItem(LOCAL_DATA, JSON.stringify(data));
    useCredentials(token, data);
  }

  function useCredentials(token, data) {
    role = (data.roles!==null && data.roles!==undefined )?data.roles[0]:'user'
    isAuthenticated = true;
    authToken = token;

    if (role == 'admin') {
      role = USER_ROLES.admin
    }
    if (role == 'user') {
      role = USER_ROLES.public
    }

    // Set the token as header for your requests!
    //$http.defaults.headers.common['Content-Type'] = {};
  }

  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    isAuthenticated = false;
    //$http.defaults.headers.common['X-Auth-Token'] = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
    window.localStorage.removeItem(LOCAL_DATA);
  }

  var search = function(userData) {
    return $q(function(resolve, reject) {
      var req = {
          url: "http://169.44.9.228:8080/mcabuddy/user",
          method:'GET',
          params: {any: userData}
       }
       $http(req).then(
          function(data) {
            // function to retrive the response
            if(data.data.status=='SUCCESS'){
              resolve(data.data.response);
            } else {
              reject('Search Failed!');
            }
          },
          function(err) {
            reject(err);
          }
       );
    });
  };

  var login = function(name, pw) {
    return $q(function(resolve, reject) {
      var req = {
          url: "http://169.44.9.228:8080/mcabuddy/user/authenticate",
          method:'POST',
          params: {email: name, pwd:pw}
       }
       $http(req).then(
          function(data) {
            // function to retrive the response
            if(data.data.status=='SUCCESS'){
              // Make a request and receive your auth token from your server
              storeUserCredentials(data.data.response.fname + '.yourServerToken', data.data.response);
              resolve(data.data.response);
            } else {
              reject('Login Failed!');
            }
          },
          function(err) {
            reject(err);
          }
       );
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
    isAuthenticated: function() {return isAuthenticated;},
    username: function() {return username;},
    role: function() {return role;}
  };
})

.service('SignupService', function($q, $http, USER_ROLES) {
  var signup = function(userData) {
    return $q(function(resolve, reject) {
      var req = {
          url: "http://169.44.9.228:8080/mcabuddy/user/new",
          method:'PUT',
          data: {}
          
       }
       $http(req).then(
          function(data) {
            // function to retrive the response
            if(data.data.status=='SUCCESS'){
              resolve(data);
            } else {
              reject('Signin Failed!');
            }
          },
          function(err) {
            reject(err);
          }
       );
    });
  };

  var addUser = function(userData) {
    //$http.defaults.headers.common['accept'] = undefined;
    return $q(function(resolve, reject) {
      var req = {
          url: "http://169.44.9.228:8080/mcabuddy/user/new",
          method:'PUT',
          data: {
            "subject": {
              "fname": "t2",
              "lname": "a2",
              "email": "t2@barclays.com",
              "phone": "+91-9860306111",
              "pwd": "password01",
              "roles": ["user", "sme"],
              "aoe": ["javascript", "ejs"]
            }
          },
          headers: {
              'Content-Type': 'application/json;charset=UTF-8'
          }
       }
       $http(req).then(
          function(data) {
            // function to retrive the response
            if(data.data.status=='SUCCESS'){
              resolve(data);
            } else {
              reject('Add User Failed!');
            }
          },
          function(err) {
            reject(err);
          }
       );
    });
  };

  var changeRole = function(userData) {
    $http.defaults.headers.common['Content-Type'] = undefined;
    return $q(function(resolve, reject) {
      var req = {
          url: "http://169.44.9.228:8080/mcabuddy/user/"+userData.email+"/role/"+userData.role+"",
          method:'PATCH',
          data: userData
          //headers: {'Access-Control-Request-Headers': 'accept, origin, content-type'}
      }
       $http(req).then(
          function(data) {
            // function to retrive the response
            if(data.data.status=='SUCCESS'){
              resolve(data);
            } else {
              reject('Update Role Failed!');
            }
          },
          function(err) {
            reject(err);
          }
       );
    });
  };

  var addExpertise = function(userData){
    //var userTockenData = JSON.parse(ProfileService.getData());
    function getAccessToken() {
      var LOCAL_DATA = 'yourData';
      var token = window.localStorage.getItem(LOCAL_DATA);
      //delete $http.defaults.headers.common["content-type"]
      return token;
    }

    return $q(function(resolve, reject) {
      var token = JSON.parse(getAccessToken());
      var req = {
          url: "http://169.44.9.228:8080/mcabuddy/user/"+userData.email+"/expertise/"+userData.expertise+"",
          method:'PATCH',
          data :{
            "accessToken": token.accessToken,
            "email": token.email
          }
       }
       $http(req).then(
          function(data) {
            // function to retrive the response
            if(data.data.status=='SUCCESS'){
              resolve(data);
            } else {
              reject('Update Expertise Failed!');
            }
          },
          function(err) {
            reject(err);
          }
       );
    });
  };

  return {
    signup: signup,
    addUser: addUser,
    changeRole: changeRole,
    addExpertise: addExpertise
  };
})

.service('DashboardService', function($q, $http, USER_ROLES) {
  var broadcast = function() {
    return $q(function(resolve, reject) {
      var req = {
          url: "http://169.44.9.228:8080/mcabuddy/channels/broadcast/messages/today",
          method:'GET',
          params: {index: 0}
       }
       $http(req).then(
          function(data) {
            // function to retrive the response
            if(data.data.status=='SUCCESS'){
              resolve(data);
            } else {
              reject('Update Role Failed!');
            }
          },
          function(err) {
            reject(err);
          }
       );
    });
  };

  var information = function() {
    return $q(function(resolve, reject) {
      var req = {
          url: "http://169.44.9.228:8080/mcabuddy/channels/information/messages/today",
          method:'GET',
          params: {index: 0}
       }
       $http(req).then(
          function(data) {
            // function to retrive the response
            if(data.data.status=='SUCCESS'){
              resolve(data);
            } else {
              reject('Update Role Failed!');
            }
          },
          function(err) {
            reject(err);
          }
       );
    });
  };

  var knowledge = function() {
    return $q(function(resolve, reject) {
      var req = {
          url: "http://169.44.9.228:8080/mcabuddy/channels/knowledge/messages/today",
          method:'GET',
          params: {index: 0}
       }
       $http(req).then(
          function(data) {
            // function to retrive the response
            if(data.data.status=='SUCCESS'){
              resolve(data);
            } else {
              reject('Update Role Failed!');
            }
          },
          function(err) {
            reject(err);
          }
       );
    });
  };

  var sos = function() {
    return $q(function(resolve, reject) {
      var req = {
          url: "http://169.44.9.228:8080/mcabuddy/channels/sos/messages/today?index=0",
          method:'GET',
          params: {index: 0}
       }
       $http(req).then(
          function(data) {
            // function to retrive the response
            if(data.data.status=='SUCCESS'){
              resolve(data);
            } else {
              reject('Update Role Failed!');
            }
          },
          function(err) {
            reject(err);
          }
       );
    });
  };

  var postMessage = function(data) {
    return $q(function(resolve, reject) {
      var req = {
          url: "http://169.44.9.228:8080/mcabuddy/"+data.channels+"/broadcast/message/new",
          method:'PUT',
          params: {},
          data: {
              "requester": {
                "accessToken": "c1d13890af522002e53a29acaf2b9e17c06a264c",
                "email": "abhinav.thakare@in.ibm.com"
              },
              "message": {
                  "title":"Test message",
                  "message":"Please ignore this is test message",
                  "likes":1,
                  "author":"abhinav.thakare@in.ibm.com",
                  "date":"2016-04-15T00:00:00Z",
                  "tags": ["java", "javascript"]
              }
          }
          // headers : {'Content-Type':undefined,}
       }
       $http(req).then(
          function(data) {
            // function to retrive the response
            if(data.data.status=='SUCCESS'){
              resolve(data);
            } else {
              reject('Post Message Failed!');
            }
          },
          function(err) {
            reject(err);
          }
       );
    });
  };

  return {
    broadcast: broadcast,
    information: information,
    knowledge: knowledge,
    sos: sos,
    postMessage: postMessage
  };
})

.factory ('ProfileService', function () {
    var getData = function () {
      var LOCAL_DATA = 'yourData';
      var token = window.localStorage.getItem(LOCAL_DATA);
      return token;
    };
    return {
      getData: getData
    };
})

.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized
      }[response.status], response);
      return $q.reject(response);
    }
  };
})

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});