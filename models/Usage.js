const Sequelize = require('sequelize')
const db = require('../config/database')

const Usage = db.define('usages', {
    usageCurrentYTD$ : {
        type : Sequelize.STRING
    },
    usageCurrentYTDQTY : {
        type : Sequelize.STRING
    },
    usageLast3Months$ : {
        type : Sequelize.STRING
    },
    usageLast3MonthsQTY : {
        type : Sequelize.STRING
    },
    usageLast6Months$ : {
        type : Sequelize.STRING
    },
    usageLast6MonthsQTY : {
        type : Sequelize.STRING
    },
    usageLast12Months$ : {
        type : Sequelize.STRING
    },
    usageLast12MonthsQTY : {
        type : Sequelize.STRING
    },
    usageLastYear$ : {
        type : Sequelize.STRING
    },
    usageLastYearQTY : {
        type : Sequelize.STRING
    },
    usageLastYTD$ : {
        type : Sequelize.STRING
    },
    usageLastYTDQTY : {
        type : Sequelize.STRING
    }
})

// db.sync()
//     .then(() => {
//         console.log('Usages Table Created Successfully!')
//     })
//     .catch(err => {
//         console.log(err)
//     })

module.exports = Usage