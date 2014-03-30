var app = require(APP_ROOT + '/app')
  , db = require(APP_ROOT + '/config/db')
  , yaml = require('yamljs');

INTRO = "You've reached Safe for Women\n"

RESP_LIST="If this is an emergency, call 911\n\
For interest in our mentor program, text back 1\n\
For more services, text back 2"

MENTOR_QUERY = "Please shortly describe why you want a mentor"

MENTOR_RESPONSE = "Thanks you, Safe for Women will be in contact \
with you as soon as possible with information about a mentor"

INCORRECT_RESPONSE = "Sorry, we could not understand your response\n"

SERVICES = "For info on "

creds = yaml.load(APP_ROOT+'/app/routes/creds.yml');
var client = require('twilio')(creds['account_sid'], creds['auth_token']);
twilio_number = creds['twilio_number']
my_number = creds['my_number']

// Base Route
app.get('/twilio', function(req, res, next) {
  query = req.query
  db.Mentor.find({ phone: query['From'] }).success(function(mentor)) {
    if(!mentor){
      parseMenteeMessage(query);  
    }
    else {
      mentor.getMentee().success(function(mentee) {
      sendMessage(mentee.phone, query['Body']);
    })       
    }
  }
});

function sendMessage(rec, body) {
  client.sendMessage({
    to:rec,
    from:twilio_number,
    body:body}, function(err, message) {
      console.log(err);
    });
}


function parseMenteeMessage(query) {
  db.Mentee.findOrCreate({ phone: query['From'] })
  .success(function(mentee, created) {
    if(created){
      sendMessage(query['From'], INTRO + RESP_LIST);
    }
    else
    {
      parseReturning(query, mentee);
    }
  })
}

function parseReturning(query, mentee){
  if(!mentee.mentor){
    if(!mentee.reason) {
      if (!mentee.wantsMentor) {
            // give them the list of options
            sendListMessage(query, mentee, function())
          } 
      else if(value ==1){
        //they're sending a reason, write it and tell them we'll be there
        mentee.respose = query['Body']
        mentee.save(function())
        sendMessage(query['From'], MENTOR_RESPONSE);
        }
      else if(value ==2){
          //want information on services
          sendMessage(query['From'], SERVICES);
        }
      } 
      else {
          //notify them we'll be with them (they've resent after already having reason)
          sendMessage(query['From'], MENTOR_RESPONSE);
        }
      }
   else {
    // send message to mentor
    mentee.getMentor().success(function(mentor) {
    sendMessage(mentor, query['Body']);
    }
  }
}

function sendListMessage(query, mentee, callback) {
  switch(query['Body'])
  {
    case '1':
      mentee.wantsMentor = '1';
      mentee.save(function(){
      sendMessage(query['From'], MENTOR_QUERY);
    })
      break;
    case '2':
      mentee.wantsMentor = '2'
      mentee.save(function(){
      sendMessage(query['From'], SERVICES);
    })
      break;
    default:
      sendMessage(query['From'], INCORRECT_RESPONSE + RESP_LIST);
      break;
  }
}
