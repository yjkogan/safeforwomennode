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
  db.Mentor.find({ where: {phone: query['From'] } }).success(function(mentor) {
    if(!mentor){
      parseMenteeMessage(query);
    }
    else {
      mentor.getMentee().success( function(mentee) {
        console.log(mentee);
      sendMessage(mentee['phone'], query['Body']);
    })
    }
  });
});

function sendMessage(rec, body) {
  client.sendMessage({
    to:rec,
    from:twilio_number,
    body:body}, function(err, message) {
      console.log(err);
    });
}

function checkMentor(query, callback) {
  db.Mentor
    .find({where: {phone: query['From']}})
    .success(function(mentor) {
      return callback(mentor);
    })
    .error(function(err) {
      console.log(err);
      return callback(null);
    });
}

function parseMenteeMessage(query) {
  db.Mentee
    .findOrCreate({ phone: query['From'] })
    .success(function(mentee, created) {
    if (created){
      sendMessage(query['From'], INTRO + RESP_LIST);
    }
    else
    {
      parseReturning(query, mentee);
    }
  })
}

function parseReturning(query, mentee){
  mentee.getMentor().success(function(mentor){
    console.log(mentor);
    if(!mentor){
      if(!mentee.reason) {
        value = query['Body'];
        if (!mentee.wantsMentor) {
              // give them the list of options
              sendListMessage(query, mentee)
            }
        else if(mentee.wantsMentor ==1){
          //they're sending a reason, write it and tell them we'll be there
          mentee.reason = query['Body']
          mentee
            .save()
            .success(function() {
              sendMessage(query['From'], MENTOR_RESPONSE);
            });
          }
        else if(mentee.wantsMentor ==2){
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
      sendMessage(mentor['phone'], query['Body']);
    }
  });
}

function sendListMessage(query, mentee) {
  switch(query['Body'])
  {
    case '1':
      mentee.wantsMentor = '1';
      mentee
        .save()
        .success(function(){
          sendMessage(query['From'], MENTOR_QUERY);
        })
      break;
    case '2':
      mentee.wantsMentor = '2'
      mentee
        .save()
        .success(function() {
          sendMessage(query['From'], SERVICES);
        });
      break;
    default:
      sendMessage(query['From'], INCORRECT_RESPONSE + RESP_LIST);
      break;
  }
}
