var Sequelize = require('sequelize')
  , models = require(APP_ROOT+'/app/models');

var sequelize = new Sequelize(process.env.DATABASE_URL);

var Mentee = sequelize.define('Mentee', models.mentee)
  , Mentor = sequelize.define('Mentor', models.mentor)
  , Admin = sequelize.define('Admin', models.admin);

Mentee.hasOne(Mentor);
Mentor.hasOne(Mentee);

module.exports = {
  sequelize: sequelize,
  Mentee: Mentee,
  Mentor: Mentor,
  Admin: Admin
};
