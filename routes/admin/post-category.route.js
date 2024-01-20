const express = require("express");
const router = express.Router();

//Nhúng multer để upload ảnh ở trên máy tính cá nhân
const multer = require("multer");
const upload = multer();
const uploadCLoud = require("../../middlewares/admin/uploadImageCloud.middleware");
const controller = require("../../controllers/admin/post-category.controller");
const validate = require("../../validates/admin/product-category.validate");

router.get("/", controller.index);

router.get("/create", controller.createPagePostCategory);

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCLoud.uploadImageCloudinary,
  validate.createPost,
  controller.createPostCategory
);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteOnItem);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCLoud.uploadImageCloudinary,
  validate.createPost,
  controller.editPatch
);

router.get("/detail/:id", controller.detail);
module.exports = router;