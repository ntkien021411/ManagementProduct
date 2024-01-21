const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/my-account.controller");
const multer = require("multer");
const upload = multer();
const uploadCLoud = require("../../middlewares/admin/uploadImageCloud.middleware");
router.get("/", controller.index);

router.get("/edit", controller.edit);

router.patch("/edit",upload.single("avatar"),
uploadCLoud.uploadImageCloudinary, controller.editPatch);
module.exports = router;