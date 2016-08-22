angular.module('app').constant('AUTH_EVENTS', {
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
}).constant('USER_ROLES', {
    admin: 'ROLE_ADMIN',
    public: 'ROLE_USER',
    sme: 'ROLE_SME'
});