suite('Comic', function() {
  'use strict';

  var expect = require('chai').expect;
  var moment = require('moment');

  var Comic = require('../lib/Comic');

  suite('constructor', function() {

    function lazyConstructor(date) {
      return function wrapper() {
        return new Comic(date);
      };
    }

    test('with invalid dates', function() {
      var invalidDates = [null,
        'a-b-c'.split('-'),
        '2030-40-50'.split('-'),
      ];

      var errorMessage = /^Invalid date: /;
      invalidDates.forEach(function(date) {
        expect(lazyConstructor(date)).to.throw(TypeError, errorMessage);
      });
    });

    test('with dates out of range', function() {
      var invalidDates = ['2000-01-01'.split('-'),
        '3000-01-01'.split('-'),
      ];

      var errorMessage = /^Date is out of valid range: /;
      invalidDates.forEach(function(date) {
        expect(lazyConstructor(date)).to.throw(RangeError, errorMessage);
      });
    });

    test('with valid dates', function() {
      var validDates = ['2009-01-01',
        '2013-12-31',
        moment.utc().format('YYYY-MM-DD'),
      ];

      validDates.forEach(function(date) {
        var components = date.split('-');
        var comic = new Comic(components);
        var comicDate = comic.date.format();
        expect(comicDate).to.equal(moment.utc(date).format());
      });
    });

  });


});
