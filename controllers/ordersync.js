const uploads = './uploads';
const uploaded = './uploaded';
var path = require('path')
const csv = require('csvtojson');
const _ = require('lodash-contrib');
const xlsx = require('xlsx')
const fs = require('fs');
const {promisify} = require('util');
const mv = promisify(fs.rename);
const sequelize = require('../config/database');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const PaymentDetail = require('../models/PaymentDetail');
const ShippingDetail = require('../models/ShippingDetail');
const BillingDetail = require('../models/BillingDetail');

const moveFile =function (oldPath, newPath) {
	fs.rename(oldPath, newPath,async function (err) {
		    if (err) {
				await mv(oldPath, newPath);
			}
		  })  
}

//? Helper Function to Rename Keys
const renameToDesiredFormat = (data) => {
	let result = [];
	data.map((item) => {
		result.push(
			_.renameKeys(item, {
				OrderID: 'orderId',
				OrderItemID: 'orderItemId',
				UserID: 'customerId',
				SiteCode: 'siteCode',
				TimeOfOrder: 'timeOfOrder',
				SubTotal: 'subTotal',
				ShippingTotal: 'shippingTotal',
				OrderDiscountsTotal: 'orderDiscountsTotal',
				ShippingDiscountsTotal: 'shippingDiscountsTotal',
				HandlingFee: 'handlingFee',
				InsuranceTotal: 'insuranceTotal',
				GiftWrapCharge: 'giftWrapCharge',
				DropShipFeeTotal: 'dropShipFeeTotal',
				GrandTotal: 'grandTotal',
				Status: 'status',
				PaymentStatus: 'paymentStatus',
				PaymentDate: 'payementDate',
				PaymentReferenceNumber: 'paymentReferenceNumber',
				PaymentMethod: 'paymentMethod',
				ShippingStatus: 'shippingStatus',
				ShipDate: 'shippingDate',
				ShippingFee: 'shippingFee',
				ShipFirstName: 'shipFirstName',
				ShipLastName: 'shippingLastName',
				ShipCompanyName: 'shipCompanyName',
				ShipAddress1: 'shipAddress1',
				ShipAddress2: 'shipAddress2',
				ShipCity: 'shipCity',
				ShipState: 'shipState',
				ShipZipCode: 'shipZipCode',
				ShipCountry: 'shipCountry',
				ShipPhoneNumber: 'shipPhoneNumber',
				OrderSource: 'orderSource',
				OrderSourceOrderID: 'orderSourceOrderId',
				OrderCurrency: 'orderCurrency',
				eBaySalesRecordNumber: 'eBaySalesRecordNumber',
				ShippingMethodSelected: 'shippingMethodSelected',
				IsRushOrder: 'isRushOrder',
				InvoicePrinted: 'invoicePrinted',
				InvoicePrintedDate: 'invoicePrintedDate',
				ShippingCarrier: 'shippingCarrier',
				PackageType: 'packageType',
				CompanyID: 'companyId',
				OrderSourceOrderTotal: 'orderSourceTotal',
				StationID: 'stationId',
				CustomerServiceStatus: 'customerServiceStatus',
				TaxRate: 'taxRate',
				TaxTotal: 'taxTotal',
				GoogleOrderNumber: 'googleOrderNumber',
				IsInDispute: 'isInDispute',
				DisputeStartedOn: 'disputeStartedOn',
				PaypalFeeTotal: 'payPalFeeTotal',
				PostingFeeTotal: 'postingFeeTotal',
				FinalValueTotal: 'finalValueTotal',
				ShippingWeightTotalOz: 'shippingWeightTotalOz',
				Qty: 'qty',
				LineTotal: 'lineTotal',
				BackOrderQty: 'backOrderQty',
				OriginalUnitPrice: 'originalUnitPrice',
				OriginalShippingCost: 'OriginalShippingCost',
				AdjustedUnitPrice: 'adjustedUnitPrice',
				AdjustedShippingCost: 'adjustedShippingCost',
				TrackingNumber: 'trackingNumber',
				SerialNumber: 'serialNumber',
				LocationNotes: 'locationNotes',
				ShippedBy: 'shippedBy',
				DeliveryDate: 'deliveryDate',
				ShipFromWarehouse: 'shipFromWarehouse',
				eBayItemID: 'eBayItemId',
				AmazonItemID: 'amazonItemId',
				MarketingSource: 'marketingSource'
			})
		);
	});
	const dateFields = [
		'deliveryDate',
		'disputeStartedOn',
		'invoicePrintedDate',
		'timeOfOrder',
		'payementDate',
		'shippingDate'
	];
	result.map((order) => {
		dateFields.map((dateHeader) => {
			if (order[dateHeader] === '') order[dateHeader] = null;
		});
	});
	return result;
};

const UploadOrder=async function(oldPath, newPath ){
  		console.log(oldPath, "--------oldPath")
		let filext = path.extname(oldPath)
		console.log(filext, "----------------------------extName")
		if (filext ==='.xlsx'){
			const wb = xlsx.readFile(oldPath,)
			const ws = wb.Sheets['sample']
			const jsonOrder = xlsx.utils.sheet_to_json(ws)
			var orders = renameToDesiredFormat(jsonOrder);
			console.log(orders, "---------------------------xlsx")
		}else if (filext ==='.csv'){
			const jsonOrders = await csv().fromFile(oldPath);
			var orders = renameToDesiredFormat(jsonOrders);
		}
		else{
			return 2;
		}
		const t =await sequelize.transaction();
		try {
			for (data of orders) {
				const orderDetails = _.pick(data, [
					'customerId',
					'orderSource',
					'orderSourceOrderId',
					'isRushOrder',
					'packageType',
					'deliveryDate',
					'locationNotes',
					'eBaySalesRecordNumber',
					'serialNumber',
					'trackingNumber',
					'disputeStartedOn',
					'isInDispute',
					'siteCode',
					'googleOrderNumber',
					'customerServiceStatus',
					'invoicePrinted',
					'invoicePrintedDate',
					'status',
					'timeOfOrder'
				]);
				const paymentDetails = _.pick(data, [
					'paymentStatus',
					'payementDate',
					'paymentReferenceNumber',
					'paymentMethod',
					'orderCurrency',
					'orderDiscountsTotal',
					'insuranceTotal',
					'subTotal',
					'grandTotal',
					'taxRate',
					'taxTotal',
					'lineTotal',
					'finalValueTotal',
					'postingFeeTotal',
					'payPalFeeTotal',
					'orderSourceTotal',
					'orderId'
				]);
				const shippingDetails = _.pick(data, [
					'shippingTotal',
					'shippingDiscountsTotal',
					'dropShipFeeTotal',
					'shippingDate',
					'shipFirstName',
					'shippingLastName',
					'shipCompanyName',
					'shipAddress1',
					'shipAddress2',
					'shipCity',
					'shipState',
					'shipZipCode',
					'shipCountry',
					'shipPhoneNumber',
					'shippingMethodSelected',
					'companyId',
					'shippingCarrier',
					'shippedBy',
					'shipFromWarehouse',
					'shippingFee',
					'originalShippingCost',
					'adjustedShippingCost',
					'shippingWeightTotalOz',
					'shippingStatus',
					'stationId',
					'orderId'
				]);
				const billingDetails = _.pick(data, [
					'billingTotal',
					'billingDiscountsTotal',
					'billingDate',
					'billingFirstName',
					'billingLastName',
					'billingCompanyName',
					'billingAddress1',
					'billingAddress2',
					'billingCity',
					'billingState',
					'billingZipCode',
					'billingCountry',
					'billingPhoneNumber',
					'billingMethodSelected'
				]);
				const orderItemDetails = _.pick(data, [
					'adjustedUnitPrice',
					'originalUnitPrice',
					'handlingFee',
					'giftWrapCharge',
					'qty',
					'backOrderQty',
					'orderId'
				]);
				const { id } = await Order.create(orderDetails, { transaction: t });
				paymentDetails.orderId = id
				shippingDetails.orderId = id
				billingDetails.orderId = id
				orderItemDetails.orderId = id
				await PaymentDetail.create(paymentDetails, { transaction: t });
				await BillingDetail.create(billingDetails, { transaction: t });
				await ShippingDetail.create(shippingDetails, { transaction: t });
				await ShippingDetail.create(shippingDetails, { transaction: t });
				await OrderItem.create(orderItemDetails, { transaction: t });
				}	// End for 

			t.commit();
			
			//  Move file to uploded folder after successfully imported 
			moveFile(oldPath, newPath)
			return 1;
			
			} catch (err) {
				t.rollback();
				return err;
		}		
	}

const Ordersync = (req, res) => {
	// Read file inside Uplods dir 
	 fs.readdir(uploads, (err, files) => {	   
		files.forEach(file => {
				const oldPath = (uploads+"/"+file)
				const newPath = (uploaded+"/"+file)
				const status = UploadOrder(oldPath, newPath)
				let date_ob1 = new Date();
				// current hours
				let hours1 = date_ob1.getHours();
	
				// current minutes
				let minutes1 = date_ob1.getMinutes();
	
				// current seconds
				let seconds1 = date_ob1.getSeconds();
				status.then(data => {
					let date_ob2 = new Date();
					// current hours
					let hours2 = date_ob2.getHours();
		
					// current minutes
					let minutes2 = date_ob2.getMinutes();
		
					// current seconds
					let seconds2 = date_ob2.getSeconds();
		
					if (data == 1){
						console.log(file," Upload time = ",(hours2-hours1) + ":" + (minutes2-minutes1)+ ":" + (seconds2- seconds1))
					}else{
						console.log(data, "---something went wrong")
						}
					}
				)
			});
	  	}); 
	}


module.exports = {
    Ordersync : Ordersync,
}

