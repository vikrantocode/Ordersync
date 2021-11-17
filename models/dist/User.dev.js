"use strict";

var Sequelize = require('sequelize');

var db = require('../config/database');

var User = db.define('users', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  phone: {
    type: Sequelize.STRING
  },
  address: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  city: {
    type: Sequelize.STRING
  },
  state: {
    type: Sequelize.STRING
  },
  country: {
    type: Sequelize.STRING
  },
  avatar: {
    type: Sequelize.STRING
  },
  zipcode: {
    type: Sequelize.STRING
  },
  company: {
    type: Sequelize.STRING
  },
  role: {
    type: Sequelize.STRING,
    defaultValue: 'user'
  },
  status: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  profileImage: {
    type: Sequelize.STRING,
    defaultValue: "https://res.cloudinary.com/nikita4206/image/upload/v1609273276/e8jjm1f2alqnaazcd591.jpg"
  }
});
db.sync().then(function () {
  console.log("Tables creates succesfully!");
})["catch"](function (err) {
  console.log(err);
});
module.exports = User;