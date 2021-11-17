const express = require('express')
const router = express.Router()
const Maincontroller = require("../controllers/MainController")
const UtilitiesController = require("../controllers/UtilitiesController")
const UserManagementController = require("../controllers/UserManagementController")
var multer = require("multer")
var storage = multer.diskStorage({});   
var upload = multer({storage:storage});


router.route("/signup").post(Maincontroller.signup)
router.route("/login").post(Maincontroller.login)
router.route("/send-OTP").post(Maincontroller.sendOTP)
router.route("/change-password").post(Maincontroller.changePassword)
router.route("/dashboard-page").get(Maincontroller.dashboard)
router.route("/googleLogin").post(Maincontroller.googleLogin)
router.route("/facebooklogin").post(Maincontroller.facebooklogin)
router.route("/countries").get(UtilitiesController.countries)
router.route("/edit-profile").post(upload.single('profileImage'),Maincontroller.editprofile)
router.route("/userData").get(Maincontroller.userData)
router.route("/users/:page").get(UserManagementController.users)
router.route("/delete-user").post(UserManagementController.deleteUser)
router.route("/new-user").post(UserManagementController.newUser)
router.route("/user-details").get(UserManagementController.userDetails)
router.route("/edit-user").post(upload.single('profileImage'),UserManagementController.editUser)
router.route("/activate").post(UserManagementController.activate)
router.route("/deactivate").post(UserManagementController.deactivate)
module.exports = router;