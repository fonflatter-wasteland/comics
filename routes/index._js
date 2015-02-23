module.exports = function (app) {
    app.get('/', function (req, res, _) {
        res.render('index.html', {title: 'fonflatter-transcriptions'});
    });
};
