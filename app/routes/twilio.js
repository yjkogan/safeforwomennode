var app = require(APP_ROOT + '/app')
  , db = require(APP_ROOT + '/config/db');

INTRO = "You've reached Safe for Women\n"

RESP_LIST="If this is an emergency, call 911\n\
For interest in our mentor program, text back 1\n\
For more services, text back 2"

MENTOR = "Thanks you, Safe for Women will be in contact \
with you as soon as possible with information about a mentor"

INCORRECT_RESPONSE = "Sorry, we could not understand your response\n"

SERVICES = "For info"

var client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
twilio_number = process.env.TWILIO_NUMBER;
my_number = process.env.MY_NUMBER;

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
