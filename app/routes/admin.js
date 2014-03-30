var app = require(APP_ROOT + '/app')
  , db = require(APP_ROOT + '/config/db');

app.get('/mentees', function(req, res, next) {
  db.Mentee
    .findAll({
      include: [db.Mentor]
    })
    .success(function(mentees) {
      return res.render('mentees', {mentees: mentees});
    })
    .error(function(err) {
      console.log(err);
      return next(err);
    });
});

app.post('/mentees', function(req, res, next) {
  var mentee_id = req.body.mentee_id;
  var mentor_phone = req.body.phone;
  if (!mentee_id) {
    return next('Missing a mentee_id');
  }
  if (!mentor_phone) {
    return next('Missing phone parameter');
  }

  db.Mentor
    .findOrCreate({phone: mentor_phone})
    .success(function(mentor, created) {
      if (!created) {
        return next('Mentor was already has mentee');
      }
      db.Mentee
        .find({
          where: {id: mentee_id},
        })
        .success(function(mentee) {
          if (!mentee) {
            return next('Could not find mentee with id ' + mentee_id);
          }
          mentee
            .setMentor(mentor)
            .success(function() {
              return res.send(mentee_id);
            })
            .error(function(err) {
              return next(err);
            });
            mentor
            .setMentee(mentee)
            .success(function() {
              
            })
            .error(function(err) {
              return next(err);
            });
        })
        .error(function(err) {
          return next(err);
        });
    })
    .error(function(err) {
      return next(err);
    })
});
