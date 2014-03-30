var app = require(APP_ROOT + '/app')
  , db = require(APP_ROOT + '/config/db');

app.get('/mentees', function(req, res, next) {
  db.Mentee
    .findAll()
    .success(function(mentees) {
      return res.render('mentees', {mentees: mentees});
    })
    .error(function(err) {
      console.log(err);
      return next();
    });
});

app.post('/mentees', function(req, res, next) {
  var mentee_id = req.query.mentee_id;
  var mentor_phone = req.query.phone;
  db.Mentor
    .findOrCreate({phone: mentor_phone})
    .success(function(mentor, created) {
      if (!created) {
        return next('Mentor was already has mentee');
      }
      db.Mentee
        .find({where: {id: mentee_id}})
        .success(function(mentee) {
          mentee.setMentor(mentor)
            .success(function() {
              return res.send(mentee_id);
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
