var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var daoAuth = require('./dao/daoAuth');

passport.use(new Strategy({
        usernameField: 'accountid',
        passwordField: 'password'
    },
    function (username, password, cb) {
        daoAuth.doLogin(username, password, function (err, results) {
            if (err || !results) {
                cb(null, false);
                return;
            }
            console.info(`LOGIN OK - ${username}`);
            cb(null, results);
        });
    }));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (user, cb) {
    cb(null, user);
});

passport.isAuthenticated = function (req, res, next) {
    // 인증 여부 체크
    if (req.isAuthenticated())
        return next();

    // 미인증 상태이면 로그인 페이지로 이동
    res.redirect('/account/login'); //?returnUrl=' + encodeURIComponent(req.originalUrl || req.url));
};

passport.isAuthenticatedRole = function (checkRole) {
    return function (req, res, next) {
        // 인증 여부 체크
        if (!req.isAuthenticated()) {
            return res.redirect('/account/login?returnUrl=' + encodeURIComponent(req.originalUrl || req.url));
        }

        if (!checkRole || checkRole.length === 0)
            return next();

        var myRoles = req.user.ROLE.split(',');

        if (myRoles.indexOf('admin') > -1)
            return next();

        for (var key in checkRole) {
            if (myRoles.indexOf(checkRole[key]) > -1)
                return next();
        }

        return res.redirect('/account/login?returnUrl=' + encodeURIComponent(req.originalUrl || req.url) + '&err=' + encodeURIComponent(__('HASNOPERMISSION')));
    };
};

/** response에 인증 정보 등을 추가 하는 Middleware */
passport.checkResponseLocalInfomations = function (req, res, next) {
    req.clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

    if (typeof res.locals != 'object') res.locals = {};

    res.locals.url = req.originalUrl;
    if (req.isAuthenticated()) {
        res.locals._authUserID = req.user.ACCOUNTID;
        res.locals._authUserName = req.user.NAME;
        res.locals._authUserRole = req.user.ROLE;
        res.locals._isAuthed = true;
    } else {
        res.locals._isAuthed = false;
    }

    next();
};

module.exports = passport;
