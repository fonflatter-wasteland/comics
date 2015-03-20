"use strict";

module.exports = function (app) {
    var comic_url_pattern = /(\d{4})\/(\d{2})\/(\d{2})\/$/;

    app.get(comic_url_pattern, function (req, res, next) {
        var comic_date = new Date(req.params[0], req.params[1], req.params[2]);
        var comic_url = comic_date.getFullYear() + "/fred_" + comic_date.toISOString().slice(0, 10) + ".png";
        res.render('transcribe.html', {app: req.app, comic_date: comic_date, comic_url: comic_url});
    });

    function isCorrectSolution(solution, num_1, num_2) {
        if (solution === 'doof') {
            return true;
        }

        return parseInt(solution) === parseInt(num_1) + parseInt(num_2);
    }

    app.post(comic_url_pattern, function (req, res, next) {
        var comic_date = new Date(req.params[0], req.params[1], req.params[2]);
        var result = {
            errors: [],
            submitted: false
        };

        if (!isCorrectSolution(req.body.solution, req.body.num_1, req.body.num_2)) {
            result.errors.push('wrong_solution');
        }

        if (!req.body.transcription) {
            result.errors.push('transcription_missing');
        }

        result.submitted = result.errors.length == 0;

        res.render('transcribe.html', {app: req.app, comic_date: comic_date, input: req.body, result: result});
    });
};
