module.exports = (function() {
  'use strict';

  var moment = require('moment');

  /**
   * Date of the first comic.
   * @const {moment}
   */
  var MIN_COMIC_DATE = moment.utc('2005-09-20', 'YYYY-MM-DD');

  /**
   * @param {Array<string>} date array of year, month, and day of month
   * @constructor
   */
  function Comic(date) {
    this.date = parseDate(date);
  }

  /**
   * @returns {string} The URL to the comic image.
   */
  Comic.prototype.getImageURL = function() {
    return this.date.format('YYYY/[fred]_YYYY-MM-DD.[png]');
  };

  /**
   * Parses the given date components.
   *
   * @param {Array<string>} components array of year, month, and day of month
   * @return {moment} The parsed date.
   */
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
      err = new TypeError('Invalid date: ' + JSON.stringify(components));
      err.status = 404;
      throw err;
    }

    if ((date < MIN_COMIC_DATE) || (date > moment.utc())) {
      err = new RangeError('Date is out of valid range: ' + date.format());
      err.status = 404;
      throw err;
    }

    return date;
  }

  return Comic;

}());
