module.exports = (function() {
  'use strict';

  var moment = require('moment');

  var MIN_COMIC_DATE = moment.utc('2005-09-20', 'YYYY-MM-DD');

  function formatImageURL(comicDate) {
    return comicDate.format('YYYY/[fred]_YYYY-MM-DD.[png]');
  }

  function parseDate(components) {
    var date;
    var err;

    try {
      date = moment.utc({
        years: parseInt(components[0]),
        months: parseInt(components[1]) - 1, // Months are zero-based
        days: parseInt(components[2]),
      });
    } catch (e) {
      date = moment.invalid();
    }

    if (!date.isValid()) {
      err = new TypeError('Invalid date!');
      err.status = 404;
      throw err;
    }

    if ((date < MIN_COMIC_DATE) || (date > moment.utc())) {
      err = new RangeError('Date is out of valid range!');
      err.status = 404;
      throw err;
    }

    return date;
  }

  return {
    formatImageURL: formatImageURL,
    parseDate: parseDate,
  };

}());
