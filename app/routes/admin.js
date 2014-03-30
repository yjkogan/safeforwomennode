var app = require(APP_ROOT + '/app')
  , db = require(APP_ROOT + '/config/db');

app.get('/login', function(req, res, next) {
  return res.render('index', {n_results: 0});
});

app.get('/mentees', function(req, res, next) {
  return res.render('mentees', {});
});
