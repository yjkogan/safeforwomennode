var pg = require('pg');

module.exports.connectDatabase = function(callback) {
  pg.connect(process.env.DATABASE_URL, function(err, client) {
    if (err) {
      console.log(err);
      process.exit(-1);
    }
    module.exports.client = client;
    return callback();
  });
}
