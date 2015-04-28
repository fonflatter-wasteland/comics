suite('index', function() {
  'use strict';

  require('streamline').register({
    cache: true,
    fibers: true,
    verbose: true,
  });

  var moment = require('moment');
  var request = require('supertest');

  var app = require('../index');

  test('front page', function(next) {
    var now = moment();
    request(app)
      .get('/')
      .expect(302)
      .expect(now.format('[Moved Temporarily. Redirecting to ]/YYYY/MM/DD/'))
      .end(next);
  });

  test('any comic', function(next) {
    request(app)
      .get('/2012/12/20/')
      .expect(200)
      .expect(/fonflatter\.de/)
      .expect(/fred_2012-12-20\.png/)
      .end(next);
  });

});
