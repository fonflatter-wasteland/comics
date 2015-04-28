module.exports = (function() {
  'use strict';

  var express = require('express-streamline');

  var errorHandler = require('fonflatter-error-handler');
  var layout = require('fonflatter-layout');
  var logger = require('morgan');
  var path = require('path');

  var app = express();

  app.use(logger('dev'));
  layout.setUpViews(app, path.join(__dirname, 'views'));

  if (app.get('env') === 'development') {
    app.use('/', layout);
  }

  require('./routes/index')(app);

  app.use(errorHandler);

  return app;
})();
