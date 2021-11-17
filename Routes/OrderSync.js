const express = require("express");
const order = require("../controllers/ordersync");

const router = express.Router();

// router.route("/details/:id").get(UserController.getUser);
router.get('/ordersync', order.Ordersync);

module.exports = router;
