var app = require(APP_ROOT + '/app')
  , db = require(APP_ROOT + '/config/db')
  , yaml = require('yamljs');

INTRO = "You've reached Safe for Women\n"

RESP_LIST="If this is an emergency, call 911\n\
For interest in our mentor program, text back 1\n\
For more services, text back 2"

MENTOR = "Thanks you, Safe for Women will be in contact \
with you as soon as possible with information about a mentor"

INCORRECT_RESPONSE = "Sorry, we could not understand your response\n"

SERVICES = "For info"

creds = yaml.load(APP_ROOT+'/app/routes/creds.yml');
var client = require('twilio')(creds['account_sid'], creds['auth_token']);
twilio_number = creds['twilio_number']
my_number = creds['my_number']

// Base Route
app.get('/twilio', function(req, res, next) {
  console.log(req.query);
  resp = parse_request(req)
  client.sendMessage({
    to:req.query['From'],
    from:twilio_number,
    body:resp}, function(err, message) {
      console.log(err);
    });
});


function parse_request(req) {
  switch(req.query['Body'])
  {
    case '1':
      return MENTOR;
      break;
    case '2':
      return SERVICES;
      break;
    default:
      return INCORRECT_RESPONSE + RESP_LIST;
      break;
  }
}
