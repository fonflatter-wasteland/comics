var express = require('express-streamline');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, _) {
  res.render('index.html', { title: 'Express' });
});

module.exports = router;
