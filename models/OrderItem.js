const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define('orderItems', {
	adjustedUnitPrice: {
		type: Sequelize.DOUBLE
	},
	originalUnitPrice: {
		type: Sequelize.DOUBLE
	},
	handlingFee: {
		type: Sequelize.DOUBLE,
		defaultValue: 0.0
	},
	giftWrapCharge: {
		type: Sequelize.DOUBLE,
		defaultValue: 0.0
	},
	backOrderQty: {
		type: Sequelize.INTEGER
	},
	qty: {
		type: Sequelize.INTEGER
	}
});

sequelize
	.sync()
	.then(() => {
		console.log('OrderItems Table created succesfully!');
	})
	.catch((err) => {
		console.log(err);
	});

module.exports = OrderItem;
