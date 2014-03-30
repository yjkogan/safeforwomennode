var app = require(APP_ROOT + '/app')
  , db = require(APP_ROOT + '/config/db');

app.get('/mentees', function(req, res, next) {
  return res.render('mentees', {});
});
