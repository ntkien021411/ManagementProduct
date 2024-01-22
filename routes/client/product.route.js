const express = require("express");
// dùng để tạo ra các router thì ko cần truyền app như file index
const router = express.Router();


const controller = require("../../controllers/client/product.controller");
// bên index đã có products nên là bên này ko cần vì sẽ nối chuỗi 2 bên với nhau
// router.get("/products", (req, res) => {
//     res.render("client/pages/products/index");
//   });
router.get("/",controller.index);

router.get("/:slugCategory",controller.category);


router.get("/detail/:slugProduct",controller.detail);

// sau khi tạo phải export router ra để nhúng ở file index hoặc file khác để dùng
module.exports = router;