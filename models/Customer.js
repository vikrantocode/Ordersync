const Sequelize = require('sequelize')
const sequelize = require('../config/database');
const Order = require('./Order');

const Customer = sequelize.define('customers', {
    username : {
        type : Sequelize.STRING,
        allowNull: false,
        unique : true
    },
    firstName : {
        type : Sequelize.STRING,
        allowNull: false
    },
    lastName : {
        type : Sequelize.STRING,
    },
    email : {
        type : Sequelize.STRING,
        validate : {
            isEmail : true
        },
        allowNull: false,
        unique : true
    },
    emailCC : {
        type : Sequelize.STRING,
        allowNull : true,
    },
    address1 : {
        type : Sequelize.TEXT
    },
    address2 : {
        type : Sequelize.TEXT
    },
    city : {
        type : Sequelize.STRING,
    },
    state : { 
        type : Sequelize.STRING,
    },
    country : {
        type : Sequelize.STRING
    },
    zipCode : {
        type : Sequelize.STRING
    },
    phone : {
        type : Sequelize.STRING
    },
    businessName : {
        type : Sequelize.STRING
    },
    creditTerm : {
        type : Sequelize.STRING
    },
    creditLimit : {
        type : Sequelize.INTEGER
    },
    userPhone1 : {
        type : Sequelize.STRING
    },
    userPhone2 : {
        type : Sequelize.STRING
    },
    userPhone3 : {
        type : Sequelize.STRING
    }
})

Customer.hasMany(Order, { onDelete : 'cascade'})

sequelize
.sync().then(()=>{
    console.log("Customers Table created succesfully!")
}).catch((err)=>{console.log(err)});

module.exports = Customer;