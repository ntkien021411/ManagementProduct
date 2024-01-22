const express = require("express");
const router = express.Router();


const controller = require("../../controllers/client/blog.controller");
router.get("/",controller.index);

router.get("/:slugCategory",controller.category);
router.get("/detail/:slugPost",controller.detail)

module.exports = router;