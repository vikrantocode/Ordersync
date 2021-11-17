const Sequelize = require('sequelize')
const db = require('../config/database')

const Selling = db.define('sellings', {
    sellingCopyShort : {
        type : Sequelize.STRING(4000)
    },
    sellingCopyMedium : {
        type : Sequelize.STRING(4000)
    },
    sellingCopyLong : {
        type : Sequelize.STRING(4500)
    },
    sellingPoint1 : {
        type : Sequelize.STRING(4500)
    },
    sellingPoint2 : {
        type : Sequelize.STRING(4500)
    },
    sellingPoint3 : {
        type : Sequelize.STRING(4500)
    },
    sellingPoint4 : {
        type : Sequelize.STRING(4500)
    },
    sellingPoint5 : {
        type : Sequelize.STRING(4500)
    },
    sellingPoint6 : {
        type : Sequelize.STRING(4500)
    },
    sellingPoint7 : {
        type : Sequelize.STRING(4500)
    },
    sellingPoint8 : {
        type : Sequelize.STRING(4500)
    },
    sellingPoint9 : {
        type : Sequelize.STRING(4500)
    },
    sellingPoint10 : {
        type : Sequelize.STRING(4500)
    },
    sellingStatementSummary : {
        type : Sequelize.STRING(4500)
    }
})

// db.sync()
//     .then(() => {
//         console.log('Sellings Table Created Successfully!')
//     })
//     .catch(err => {
//         console.log(err)
//     })

module.exports = Selling