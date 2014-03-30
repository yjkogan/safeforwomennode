require('./config');

var express = require('express')
  , hoganEngine = require('hogan-engine')
  , app = express()
  , db = require(APP_ROOT+'/config/db');

module.exports = app;

app.configure(function() {
  app.engine('html', hoganEngine);
  app.set('views', __dirname + '/app/templates');
  app.set('view engine', 'html');
  app.use(express.static(__dirname + '/public'));

  // Enable us to get form data / read the body
  app.use(express.bodyParser());

  // Require the routes
  require('./app/routes');

  //Error handling
  app.use(function (err, req, res, next) {

    // log it
    console.log("Error is:");
    console.log(err);

    if (err.stack) {
      console.log(err.stack);
    }

    // error page
    res.status(500).send(err);

  });

  // assume 404 since no middleware responded
  app.use(function (req, res, next) {
    res.render('errors/404', { url: req.originalUrl });
  });
})

app.listen(process.env.PORT);
console.log("Listening on port " + process.env.PORT);
