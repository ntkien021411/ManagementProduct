const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/role.controller");

router.get("/", controller.index);

router.get("/create", controller.createRolePage);
const validate = require("../../validates/admin/product.validate");

router.post("/create",validate.createPost, controller.createRole);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  validate.createPost,
  controller.editPatch
);

router.delete("/delete/:id", controller.deleteOnItem);

router.get("/detail/:id", controller.detail);
module.exports = router;