var express = require('express-streamline');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');

var layout = require('fonflatter-layout/app');

var app = express();

app.locals.views = [layout.locals.views, path.join(__dirname, 'views')];

// view engine setup
var viewLoader = new nunjucks.FileSystemLoader(app.locals.views);
var viewEnv = new nunjucks.Environment(viewLoader, { autoescape: true });
viewEnv.express(app);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./routes/index')(app);

if (app.get('env') === 'development') {
    app.use('/', layout);
}

// catch 404 and forward to error handler
app.use(function(req, res, _) {
    var err = new Error('Not Found');
    err.status = 404;
    throw err;
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, _) {
        res.status(err.status || 500);
        res.render('error.html', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, _) {
    res.status(err.status || 500);
    res.render('error.html', {
        message: err.message,
        error: {}
    });
});

app.use('/', layout);

module.exports = app;
