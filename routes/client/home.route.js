const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/home.controller");
router.get("/", controller.index);
// sau khi tạo phải export router ra để nhúng ở file index hoặc file khác để dùng
module.exports = router;