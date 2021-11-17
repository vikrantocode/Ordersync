const Sequelize = require('sequelize')
const sequelize = require('../config/database')

const ShippingDetail = sequelize.define('shippingDetails', {
    shippingTotal : {
        type : Sequelize.DOUBLE
    },
    shippingDiscountsTotal : {
        type : Sequelize.DOUBLE
    },
    dropShipFeeTotal : {
        type : Sequelize.DOUBLE
    },
    shippingDate : {
        type : Sequelize.DATE
    },
    shipFirstName : {
        type : Sequelize.STRING
    },
    shippingLastName : {
        type : Sequelize.STRING
    },
    shipCompanyName : {
        type : Sequelize.STRING
    },
    shipAddress1 : {
        type : Sequelize.STRING
    },
    shipAddress2 : {
        type : Sequelize.STRING
    },
    shipCity : {
        type : Sequelize.STRING
    },
    shipState : {
        type : Sequelize.STRING
    },
    shipZipCode : {
        type : Sequelize.STRING
    },
    shipCountry : {
        type : Sequelize.STRING
    },
    shipPhoneNumber : {
        type : Sequelize.STRING
    },
    shippingMethodSelected : {
        type : Sequelize.STRING
    },
    companyId : {
        type : Sequelize.STRING
    },
    shippingCarrier : {
        type : Sequelize.STRING
    },
    shippedBy : {
        type : Sequelize.STRING
    },
    shipFromWarehouse : {
        type : Sequelize.STRING
    },
    shippingFee : {
        type : Sequelize.STRING
    },
    originalShippingCost : {
        type : Sequelize.DOUBLE
    },
    adjustedShippingCost : {
        type : Sequelize.DOUBLE
    },
    shippingWeightTotalOz : {
        type : Sequelize.DOUBLE
    },
    shippingStatus : {
        type : Sequelize.STRING
    },
    stationId : {
        type : Sequelize.STRING
    },
})

sequelize
.sync().then(()=>{
    console.log("Shipping Details Table created succesfully!")
}).catch((err)=>{console.log(err)});

module.exports = ShippingDetail