const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/role.controller");

router.get("/", controller.index);

router.get("/create", controller.createRolePage);
const validate = require("../../validates/admin/product.validate");

router.post("/create",validate.createPost, controller.createRole);

router.get("/edit/:id", controller.editPage);

router.patch(
  "/edit/:id",
  validate.createPost,
  controller.editRole
);


router.get("/detail/:id", controller.detail);
router.delete("/delete/:id", controller.deleteRole);
module.exports = router;