module.exports = function(app) {
  'use strict';

  var moment = require('moment');

  var Comic = require('../lib/Comic');

  app.get('/', function(req, res, _) {
    res.redirect(moment().format('/YYYY/MM/DD/'));
  });

  app.get(Comic.URL_PATTERN, function(req, res, _) {
    res.render('index.html', {
      comic: new Comic(req.params),
      title: 'fonflatter-comics',
    });
  });
};
