module.exports = function(app) {
  'use strict';

  app.get('/', function(req, res, _) {
    res.render('index.html', {
      title: 'fonflatter-transcriptions',
    });
  });
};