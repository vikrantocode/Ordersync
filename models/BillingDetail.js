const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const BillingDetail = sequelize.define('billingDetails', {
	billingTotal: {
		type: Sequelize.DOUBLE
	},
	billingDiscountsTotal: {
		type: Sequelize.DOUBLE
	},
	billingDate: {
		type: Sequelize.DATE
	},
	billingFirstName: {
		type: Sequelize.STRING
	},
	billingLastName: {
		type: Sequelize.STRING
	},
	billingCompanyName: {
		type: Sequelize.STRING
	},
	billingAddress1: {
		type: Sequelize.STRING
	},
	billingAddress2: {
		type: Sequelize.STRING
	},
	billingCity: {
		type: Sequelize.STRING
	},
	billingState: {
		type: Sequelize.STRING
	},
	billingZipCode: {
		type: Sequelize.STRING
	},
	billingCountry: {
		type: Sequelize.STRING
	},
	billingPhoneNumber: {
		type: Sequelize.STRING
	},
	billingMethodSelected: {
		type: Sequelize.STRING
	}
});

sequelize
	.sync()
	.then(() => {
		console.log('billing Details Table created succesfully!');
	})
	.catch((err) => {
		console.log(err);
	});

module.exports = BillingDetail;
