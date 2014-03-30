var app = require(APP_ROOT + '/app')
  , db = require(APP_ROOT + '/config/db');

// Base Route
app.get('/', function(req, res, next) {
  db.client.query('SELECT * FROM mentees', function(err, result) {
    if (err) {
      console.log(err);
    }
    return res.render('index', {n_results: result.rows.length});
  });
});

require('./twilio');
