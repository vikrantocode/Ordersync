const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const PaymentDetail = sequelize.define('paymentDetails', {
	paymentStatus: {
		type: Sequelize.STRING
	},
	payementDate: {
		type: Sequelize.DATE
	},
	paymentReferenceNumber: {
		type: Sequelize.STRING
	},
	paymentMethod: {
		type: Sequelize.STRING
	},
	orderCurrency: {
		type: Sequelize.STRING
	},
	orderDiscountsTotal: {
		type: Sequelize.DOUBLE
	},
	insuranceTotal: {
		type: Sequelize.DOUBLE
	},
	subTotal: {
		type: Sequelize.DOUBLE
	},
	grandTotal: {
		type: Sequelize.DOUBLE
	},
	taxRate: {
		type: Sequelize.DOUBLE
	},
	taxTotal: {
		type: Sequelize.DOUBLE
	},
	lineTotal: {
		type: Sequelize.DOUBLE
	},
	finalValueTotal: {
		type: Sequelize.DOUBLE
	},
	postingFeeTotal: {
		type: Sequelize.DOUBLE
	},
	payPalFeeTotal: {
		type: Sequelize.DOUBLE
	},
	orderSourceTotal: {
		type: Sequelize.DOUBLE
	}
});

sequelize
	.sync()
	.then(() => {
		console.log('Payment Details Table created succesfully!');
	})
	.catch((err) => {
		console.log(err);
	});

module.exports = PaymentDetail;
