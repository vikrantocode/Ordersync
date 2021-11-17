const Sequelize = require('sequelize');
const db = require('../config/database');

const PriceAndCost = db.define('pricesAndCosts', {
	unitOfMeasure: {
		type: Sequelize.STRING
	},
	listPrice: {
		type: Sequelize.STRING
	},
	listPriceEffectiveDate: {
		type: Sequelize.DATE
	},
	pricePlan: {
		type: Sequelize.STRING
	},
	pricePlanName: {
		type: Sequelize.STRING
	},
	pricePlanType: {
		type: Sequelize.STRING
	},
	priceStartDate: {
		type: Sequelize.DATE
	},
	priceEndDate: {
		type: Sequelize.DATE
	},
	costColumn1Quantity: {
		type: Sequelize.STRING
	},
	costColumn1Price: {
		type: Sequelize.STRING
	},
	costColumn2Quantity: {
		type: Sequelize.STRING
	},
	costColumn2Price: {
		type: Sequelize.STRING
	},
	costColumnType: {
		type: Sequelize.STRING
	},
	costFacilityCode: {
		type: Sequelize.STRING
	},
	costStartColumn: {
		type: Sequelize.STRING
	},
	costStopColumn: {
		type: Sequelize.STRING
	},
	costTypeCode: {
		type: Sequelize.STRING
	},
	lastInvoicedAmount: {
		type: Sequelize.STRING
	},
	lastInvoicedDate: {
		type: Sequelize.DATE
	},
	lastInvoicedNumber: {
		type: Sequelize.STRING
	},
	lastInvoicedPricePlan: {
		type: Sequelize.STRING
	},
	azertyCalcConsPrice1: {
		type: Sequelize.STRING
	},
	azertyCalcConsPrice2: {
		type: Sequelize.STRING
	},
	azertyMarginFormula: {
		type: Sequelize.STRING
	},
	MAPP: {
		type: Sequelize.BOOLEAN
	},
	IMAPP: {
		type: Sequelize.BOOLEAN
	},
	MAPPPrice: {
		type: Sequelize.STRING
	},
	IMAPPPrice: {
		type: Sequelize.STRING
	},
	freightPrice: {
		type: Sequelize.DOUBLE
	},
	MSRP: {
		type: Sequelize.DOUBLE
	}
});

db.sync()
	.then(() => {
		console.log('Prices And Costs Table Created Successfully!');
	})
	.catch((err) => {
		console.log(err);
	});

module.exports = PriceAndCost;
