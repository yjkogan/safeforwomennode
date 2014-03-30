var app = require(APP_ROOT + '/app')
  , db = require(APP_ROOT + '/config/db');

INTRO = "You've reached Safe for Women\n"

RESP_LIST="If this is an emergency, call 911\n\
For interest in our mentor program, text back 1\n\
For more services, text back 2"

MENTOR_QUERY = "Please shortly describe why you want a mentor"

MENTOR_RESPONSE = "Thanks you, Safe for Women will be in contact \
with you as soon as possible with information about a mentor"

INCORRECT_RESPONSE = "Sorry, we could not understand your response\n"

SERVICES = "For info on "

var client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
twilio_number = process.env.TWILIO_NUMBER;
my_number = process.env.MY_NUMBER;

// Base Route
app.get('/twilio', function(req, res, next) {
  query = req.query
  checkMentor(query, function(mentor) {
    if(mentor){
      mentor.getMentee().success(function(mentee) {
        sendMessage(mentee.phone, query['Body']);
    })
    }
    else {
      parseMenteeMessage(query);    
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
