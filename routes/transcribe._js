var fs = require('fs-extra');
var sprintf = require('sprintf');

module.exports = function (app) {
    var comic_url_pattern = /(\d{4})\/(\d{2})\/(\d{2})\/$/;

    app.get(comic_url_pattern, function (req, res, _) {
        var comic_date = new Date(req.params[0], req.params[1], req.params[2]);
        var comic_url = comic_date.getFullYear() + "/fred_" + comic_date.toISOString().slice(0, 10) + ".png";
        res.render('transcribe.html', {app: req.app, comic_url: comic_url});
    });

    function isCorrectSolution(solution, num_1, num_2) {
        if (solution === 'doof') {
            return true;
        }

        return parseInt(solution) === parseInt(num_1) + parseInt(num_2);
    }

    function saveTranscription(comic_date, data, _) {
        var file_path = sprintf('data/transcriptions/%(year)04d/%(month)02d/%(day)02d/', {
            year: comic_date.getFullYear(),
            month: comic_date.getMonth(),
            day: comic_date.getDay()
        });

        fs.mkdirp(file_path, _);

        var now = new Date(Date.now());
        var file_name = file_path + now.toISOString() + '.json';
        fs.writeFile(file_name, JSON.stringify({
                name: data.name,
                text: data.text
            }, null, 4) + '\n',
            _
        );
    }

    app.post(comic_url_pattern, function (req, res, _) {
        var comic_date = new Date(parseInt(req.params[0]), parseInt(req.params[1]), parseInt(req.params[2]));
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


        if (result.errors.length == 0) {
            try {
                saveTranscription(comic_date, {
                    name: req.body.name,
                    text: req.body.transcription
                }, _);
                result.submitted = true;
            }
            catch (e) {
                console.log(e.stack);
                result.errors.push('could_not_save');
            }
        }

        res.render('transcribe.html', {app: req.app, input: req.body, result: result});
    });
};
