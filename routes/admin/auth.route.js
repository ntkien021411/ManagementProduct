const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/auth.controller");
const validate = require("../../validates/admin/auth.validate");

router.get("/login", controller.loginPage);

router.post("/login",validate.login, controller.login);


router.get("/logout",controller.logout);

module.exports = router;