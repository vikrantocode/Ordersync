const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const BillingDetail = require('./BillingDetail');
const OrderItem = require('./OrderItem');
const PaymentDetail = require('./PaymentDetail');
const ShippingDetail = require('./ShippingDetail');

const Order = sequelize.define('orders', {
	orderSource: {
		type: Sequelize.STRING
	},
	orderSourceOrderId: {
		type: Sequelize.STRING
	},
	isRushOrder: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	},
	packageType: {
		type: Sequelize.STRING
	},
	deliveryDate: {
		type: Sequelize.DATE
	},
	locationNotes: {
		type: Sequelize.STRING
	},
	eBaySalesRecordNumber: {
		type: Sequelize.STRING
	},
	serialNumber: {
		type: Sequelize.STRING
	},
	trackingNumber: {
		type: Sequelize.STRING
	},
	disputeStartedOn: {
		type: Sequelize.DATE
	},
	isInDispute: {
		type: Sequelize.BOOLEAN
	},
	siteCode: {
		type: Sequelize.STRING
	},
	googleOrderNumber: {
		type: Sequelize.STRING
	},
	customerServiceStatus: {
		type: Sequelize.STRING
	},
	invoicePrinted: {
		type: Sequelize.BOOLEAN
	},
	invoicePrintedDate: {
		type: Sequelize.DATE
	},
	status: {
		type: Sequelize.STRING
	},
	timeOfOrder: {
		type: Sequelize.DATE
	},
	finalSale: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	}
});

Order.hasMany(OrderItem, { onDelete: 'cascade' });
Order.hasOne(ShippingDetail, { onDelete: 'cascade' });
Order.hasOne(BillingDetail, { onDelete: 'cascade' });
Order.hasOne(PaymentDetail, { onDelete: 'cascade' });

sequelize
	.sync()
	.then(() => {
		console.log('Orders Table created succesfully!');
	})
	.catch((err) => {
		console.log(err);
	});

module.exports = Order;
