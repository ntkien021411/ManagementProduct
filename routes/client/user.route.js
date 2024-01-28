const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/user.controller");
const validate = require("../../validates/client/user.validate");
router.get("/register",controller.register);

router.post("/register",validate.registerAccount,controller.registerPatch);

router.get("/login",controller.login);

router.post("/login",validate.loginAccount,controller.loginPatch);

router.get("/logout",controller.logout);
module.exports = router;