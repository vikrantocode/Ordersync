const express = require('express');
const multer = require('multer');
const CustomerController = require('../controllers/CustomerManagement/CustomerController');
const router = express.Router();
const uploadcsv = multer({ dest: 'temp/' });

//?Customer APIs
router.route('/all').get(CustomerController.getAllCustomers);
router.route('/search').get(CustomerController.searchCustomers);
router.route('/').post(CustomerController.addCustomer);
router.route('/:page').get(CustomerController.getCustomers);
router.route('/details/:id').get(CustomerController.getCustomer);
router
	.route('/import')
	.post(uploadcsv.single('importFile'), CustomerController.importCustomers);
router.route('/update/:id').post(CustomerController.updateCustomer);
router.route('/delete').post(CustomerController.deleteCustomer);

module.exports = router;
