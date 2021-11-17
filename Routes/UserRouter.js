const express = require("express");
const UserController = require("../controllers/UserManagement/UserController");

const router = express.Router();

router.route("/details/:id").get(UserController.getUser);

module.exports = router;
