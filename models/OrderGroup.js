const Sequelize = require('sequelize');
const db = require('../config/database');
const Order = require('./Order');

const OrderGroup = db.define('orderGroups', {
	name: {
		type: Sequelize.STRING
	}
});

const OrderGroupOrder = db.define(
	'orderGroupOrders',
	{},
	{ timestamps: false }
);
OrderGroup.belongsToMany(Order, { through: OrderGroupOrder });
Order.belongsToMany(OrderGroup, { through: OrderGroupOrder });

db.sync()
	.then(() => {
		console.log('Order Groups Table Created Successfully!');
	})
	.catch((err) => {
		console.log(err);
	});

module.exports = { OrderGroup, OrderGroupOrder };
