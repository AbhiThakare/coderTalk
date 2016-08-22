angular.module('app').constant('AUTH_EVENTS', {
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
}).constant('USER_ROLES', {
    admin: 'ROLE_ADMIN',
    public: 'ROLE_USER',
    sme: 'ROLE_SME'
}).constant('URL', {
    url: 'http://169.44.124.140:8091/codertalk/user/',
    urlChannels: 'http://inmbz2239.in.dst.ibm.com:8091/codertalk/channels/'
});