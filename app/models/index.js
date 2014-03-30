var Sequelize = require('sequelize');

module.exports = {
  mentee: {
    phone: {
      type: Sequelize.STRING,
      required: true
    },
    reason: Sequelize.TEXT
  },
  mentor: {
    name: Sequelize.STRING,
    phone: {
      type: Sequelize.STRING,
      required: true
    }
  },
  admin: {
    email: Sequelize.STRING,
    password: Sequelize.STRING
  }
};
