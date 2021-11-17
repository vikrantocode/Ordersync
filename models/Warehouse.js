const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Warehouse = sequelize.define("warehouses", {
  name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  type: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  quickBooksName: {
    type: Sequelize.STRING,
  },
  handlingTime: {
    type: Sequelize.STRING,
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  middleName: {
    type: Sequelize.STRING,
  },
  lastName: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  address1: {
    type: Sequelize.STRING,
  },
  address2: {
    type: Sequelize.STRING,
  },
  city: {
    type: Sequelize.STRING,
  },
  state: {
    type: Sequelize.STRING,
  },
  zipCode: {
    type: Sequelize.STRING,
  },
  country: {
    type: Sequelize.STRING,
  },
  sellable: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  isDefault: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  fbaShipmentAllow: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  inventoryReportExclude: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

sequelize
  .sync()
  .then(() => {
    console.log("Warehouses Table created succesfully!");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = Warehouse;