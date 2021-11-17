const Sequelize = require("sequelize");
const db = require("../config/database");
const Warehouse = require("./Warehouse");

const User = db.define("users", {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phone: {
    type: Sequelize.STRING,
  },
  address: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  city: {
    type: Sequelize.STRING,
  },
  state: {
    type: Sequelize.STRING,
  },
  country: {
    type: Sequelize.STRING,
  },
  avatar: {
    type: Sequelize.STRING,
  },
  zipcode: {
    type: Sequelize.STRING,
  },
  company: {
    type: Sequelize.STRING,
  },
  role: {
    type: Sequelize.STRING,
    defaultValue: "user",
  },
  status: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  profileImage: {
    type: Sequelize.STRING,
  },
});

User.hasMany(Warehouse, { onDelete: "cascade" });

db.sync()
  .then(() => {
    console.log("Tables created succesfully!");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = User;
