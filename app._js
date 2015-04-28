module.exports = (function() {
  'use strict';

  var express = require('express-streamline');

  var bodyParser = require('body-parser');
  var cookieParser = require('cookie-parser');
  var errorHandler = require('fonflatter-error-handler');
  var favicon = require('serve-favicon');
  var layout = require('fonflatter-layout');
  var logger = require('morgan');
  var path = require('path');

  var app = express();

  // Uncomment after placing your favicon in /public
  // app.use(favicon(__dirname + '/public/favicon.ico'));
  app.use(logger('dev'));
  layout.setUpViews(app, path.join(__dirname, 'views'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(cookieParser());

  if (app.get('env') === 'development') {
    app.use('/', layout);
  }

  require('./routes/index')(app);

  app.use(errorHandler);

  return app;
})();
