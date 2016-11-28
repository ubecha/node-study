var express = require('express');
var passport = require('../module/auth.js');
var router = express.Router();

/** 로그인 UI */
router.get('/login', function (req, res, next) {
    res.render('account/login', {
        title: __('SIGNIN'),
        layout: 'layoutEmpty',
        accountid: req.query.accountid,
        returnUrl: req.query.returnUrl,
        err: req.query.err
    });
});

/** 로그인 처리 */
router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return res.render('account/login', {
                title: __('SIGNIN'),
                layout: 'layoutEmpty',
                accountid: req.body.accountid,
                err: 'Invalid user account or password[1]'
            });
        }
        if (!user) {
            return res.render('account/login', {
                title: __('SIGNIN'),
                layout: 'layoutEmpty',
                accountid: req.body.accountid,
                err: 'Invalid user account or password[2]'
            });
        }
        req.logIn(user, function (err) {
            if (err) {
                return res.render('account/login', {
                    title: __('SIGNIN'),
                    layout: 'layoutEmpty',
                    accountid: req.body.accountid,
                    err: 'Invalid user account or password[3]'
                });
            }
            return res.redirect(req.body.returnUrl || '/');
        });
    })(req, res, next);
});

router.get('/logout', function (req, res, next) {
    // logout
    req.logout();
    // 세션 삭제
    req.session.destroy(function (err) {
        // 세션 정보에 접근 못 하는 영역
        if (err)
            console.error(err);
    });
    res.clearCookie(config.session.key); // 세션 쿠키 삭제
    res.redirect('/');
});

/** Single Sign On을 위한 인증 API */
router.get('/sso', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/account/login?returnUrl=' + encodeURIComponent(req.originalUrl || req.url));
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            // 정상 로그인 후 처리
            return res.redirect(req.query.returnUrl || '/');
        });
    })(req, res, next);
});

module.exports = router;
