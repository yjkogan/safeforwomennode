var app  = require(APP_ROOT + '/app');

// Base Route
app.get('/', function(req, res, next) {
  return res.render('index', {});
});