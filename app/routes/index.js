var app = require(APP_ROOT + '/app')
  , db = require(APP_ROOT + '/config/db');

// Base Route
app.get('/', function(req, res, next) {
  db.Mentee
    .findAll()
    .success(function(mentees) {
      return res.render('index', {n_results: mentees.length});
    })
    .error(function(err) {
      console.log(err);
      return res.send(err);
    })

});

require('./twilio');
require('./admin');

// Only do this in development mode
if (process.env.NODE_ENV == 'development'){
  app.get('/reset-db', function(req, res, next) {
    db.Mentee.sync({force: true});
    db.Mentor.sync({force: true});
    db.Admin.sync({force: true});
    return res.send('Database was reset');
  })
}
