const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/user.controller");
const validate = require("../../validates/client/user.validate");
router.get("/register",controller.register);

router.post("/register",validate.registerAccount,controller.registerPatch);

router.get("/login",controller.login);

router.post("/login",validate.loginAccount,controller.loginPatch);

router.get("/logout",controller.logout);

router.get("/password/forgot",controller.forgotPassword);

router.post("/password/forgot",validate.forgotPassword, controller.forgotPasswordPatch);

router.get("/password/otp",controller.otp);

router.post("/password/otp",controller.otpPatch);

module.exports = router;