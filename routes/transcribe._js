module.exports = function(app) {
  'use strict';

  var fs = require('fs-extra');
  var sprintf = require('sprintf');

  var Comic = require('../lib/Comic');

  var COMIC_URL_PATTERN = /(\d{4})\/(\d{2})\/(\d{2})\/$/;
  var MAX_NUM_TRANSCRIPTIONS = 10;

  function getDefaultValues(comicDate, _) {
    var filePath = getFilePath(comicDate);
    var transcriptionFiles = fs.readdir(filePath, _);
    transcriptionFiles.sort();
    var lastTranscriptionFile = transcriptionFiles.pop();

    var lastTranscription = fs.readJSON(filePath + '/' + lastTranscriptionFile,
      _);
    lastTranscription.date =
      new Date(lastTranscriptionFile.substr(0, 24)).toISOString().substr(0, 10);

    return lastTranscription;
  }

  function getFilePath(comicDate) {
    return sprintf('data/transcriptions/%(year)04d/%(month)02d/%(day)02d/', {
      year: comicDate.getFullYear(),
      month: comicDate.getMonth() + 1,
      day: comicDate.getDate(),
    });
  }

  function isCorrectSolution(solution, firstNumber, secondNumber) {
    if (solution === 'doof') {
      return true;
    }

    return parseInt(solution) ===
      parseInt(firstNumber) + parseInt(secondNumber);
  }

  function saveTranscription(comicDate, data, _) {
    var filePath = getFilePath(comicDate);

    fs.mkdirp(filePath, _);

    if (fs.readdir(filePath, _).length + 1 > MAX_NUM_TRANSCRIPTIONS) {
      throw new Error('Too many transcriptions for ' +
      comicDate.toISOString().substr(0, 10) + '!');
    }

    if (!data.user) {
      data.user = null;
    }

    var now = new Date(Date.now());
    var fileName = filePath + now.toISOString() + '.json';
    fs.writeFile(fileName, JSON.stringify({
      user: data.user,
      text: data.text,
    }, null, 4) + '\n', _);
  }

  app.get(COMIC_URL_PATTERN, function(req, res, _) {
    var comicDate = Comic.parseDate(req.params);
    var imageUrl = Comic.formatImageURL(comicDate);

    var input;
    try {
      input = getDefaultValues(comicDate, _);
    } catch (e) {
      input = {};
    }

    res.render('transcribe.html', {
      app: req.app,
      imageUrl: imageUrl,
      input: input,
    });
  });

  app.post(COMIC_URL_PATTERN, function(req, res, _) {
    var comicDate = Comic.parseDate(req.params);
    var result = {
      errors: [],
      submitted: false,
    };

    if (!isCorrectSolution(req.body.solution, req.body.firstNumber,
        req.body.secondNumber)) {
      result.errors.push('wrong_solution');
    }

    if (!req.body.text) {
      result.errors.push('transcription_missing');
    }

    if (result.errors.length === 0) {
      try {
        saveTranscription(comicDate, {
          user: req.body.user.trim(),
          text: req.body.text,
        }, _);
        result.submitted = true;
      } catch (e) {
        console.log(e.stack);
        result.errors.push('could_not_save');
      }
    }

    res.render('transcribe.html', {
      app: req.app,
      input: req.body,
      result: result,
    });
  });
};
