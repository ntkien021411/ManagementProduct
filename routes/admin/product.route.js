const express = require("express");
const router = express.Router();

//Nhúng multer để upload ảnh ở trên máy tính cá nhân
const multer = require("multer");
const upload = multer();


const controller = require("../../controllers/admin/product.controller");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);
//thay đổi nhiều và xóa mềm nhiều sản phẩm đều ở trong controller này
router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteOnItem);

router.get("/create", controller.createPage);

// req.file is the `thumbnail` fil
//validate
const validate = require("../../validates/admin/product.validate");
const uploadCLoud = require("../../middlewares/admin/uploadImageCloud.middleware");
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCLoud.uploadImageCloudinary,
  // hàm validate này ko lỗi thì mới chạy tới controller ở tham số thứ 4
  validate.createPost,
  controller.createItem
);

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
