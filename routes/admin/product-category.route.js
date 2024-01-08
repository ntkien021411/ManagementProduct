const express = require("express");
const router = express.Router();

//Nhúng multer để upload ảnh ở trên máy tính cá nhân
const multer = require("multer");
const upload = multer();

const controller = require("../../controllers/admin/product-category.controller");
const validate = require("../../validates/admin/product-category.validate");
const uploadCLoud = require("../../middlewares/admin/uploadImageCloud.middleware");

router.get("/", controller.index);

router.get("/create", controller.createPageProductCategory);

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCLoud.uploadImageCloudinary,
  // hàm validate này ko lỗi thì mới chạy tới controller ở tham số thứ 4
  validate.createPost,
  controller.createProductCategory
);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteOnItem);
module.exports = router;