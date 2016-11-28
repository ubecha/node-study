var common = require('./module/common');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var exphbs = require('express-handlebars');
var hbshelper = require('./module/hbshelper');

var session = require('express-session');
var redis = require('redis');
var redisStore = require('connect-redis')(session);

var passport = require('./module/auth.js');

var i18n = require('i18n');

var app = express();

i18n.configure({
    locales: global.config.locales,
    cookie: 'locale',
    directory: path.join(__dirname, 'locales')
});

function _multilang() {
    return i18n.__.apply(this, arguments);
}

function _multilangn() {
    return i18n.__n.apply(this, arguments);
}

global.__ = _multilang;
global.__n = _multilangn;

// view engine setup
app.engine('hbs', exphbs({
    defaultLayout: 'layout',
    extname: '.hbs',
    helpers: common.extend({}, hbshelper, {
        '__': _multilang,
        '__n': _multilangn
    })
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

if (global.config.logging) {
    // production
    // for file logging
    var rotatorFileStream = require('file-stream-rotator');
    var fs = require('fs');

    var logDirectory = path.join(__dirname, global.config.logging.path);
    if (!fs.existsSync(logDirectory))
        fs.mkdirSync(logDirectory);
    var streamAccessLog = rotatorFileStream.getStream(
        common.extend({}, global.config.logging.option, {
            "filename": path.join(logDirectory, global.config.logging.option.fileFormat)
        })
    );
    app.use(logger('combined', {
        stream: streamAccessLog
    }));
} else {
    // development
    app.use(logger('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));
app.use(session({
    key: config.session.key,
    secret: config.session.secret,
    store: new redisStore(common.extend({
        host: "127.0.0.1",
        port: 6379,
        prefix: "session:",
        db: 0
    }, config.redis)),
    saveUninitialized: false, // false == don't create session until something stored,
    resave: false // don't save session if unmodified
}));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

app.use(i18n.init);

app.use(passport.checkResponseLocalInfomations);

// Routes(controllers)
app.use('/', require('./routes/dashboard'));
app.use('/account', require('./routes/account'));
app.use('/dealerman', require('./routes/dealerman'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        layout: 'layoutEmpty',
        message: err.message,
        refer: req.originalUrl,
        error: (app.get('env') === 'development') ? err : {}
    });
});

module.exports = app;
