// Imports
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
  // res.sendfile('index.html', {root: path.join(__dirname, './views/index.html')});
});

// Exports router
module.exports = router;
