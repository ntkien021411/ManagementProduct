const express = require("express");
const router = express.Router();
//Nhúng multer để upload ảnh ở trên máy tính cá nhân
const multer = require("multer");
const upload = multer();
const uploadCLoud = require("../../middlewares/admin/uploadImageCloud.middleware");
const controller = require("../../controllers/admin/setting.controller");

router.get("/general", controller.general);

router.patch(
  "/general",
  upload.single("logo"),
  uploadCLoud.uploadImageCloudinary,
  controller.generalPatch
);
module.exports = router;
