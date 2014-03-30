var yaml = require('yamljs');
function set(name, value) {
  if (!(name in process.env)) {
    process.env[name] = value;
  }
}

// ---------------------- //
// --  Server Settings -- //
// ---------------------- //

set('NODE_ENV', 'development');

// The port for the HTTP server to listen on
set('PORT', 5432);
set('DATABASE_URL', 'postgres://ikpbwvrjkkccma@ec2-54-225-101-64.compute-1.amazonaws.com/dd5n435ihadob4');

// Twilio Info
if (process.env.NODE_ENV == 'development') {
  var creds = yaml.load('creds.yml');
  set('ACCOUNT_SID', creds['account_sid']);
  set('AUTH_TOKEN', creds['auth_token']);
  set('TWILIO_NUMBER', creds['twilio_number']);
  set('MY_NUMBER', creds['my_number']);
}
