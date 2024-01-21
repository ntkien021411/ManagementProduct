const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");
var md5 = require("md5");

// [GET] /admin/my-account/
module.exports.index = async (req, res) => {
  res.render("admin/pages/my-account/index", {
    title: "Thông tin cá nhân",
  });
};

// [GET] /admin/my-account/edit
module.exports.edit = async (req, res) => {
  res.render("admin/pages/my-account/edit", {
    title: "Chỉnh sửa thông tin cá nhân",
  });
};

// [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
    const id = res.locals.user.id;
    const accountExist = await Account.findOne({
        _id : {$ne: id},
        email: req.body.email,
        deleted: false,
      });
      if (accountExist) {
        req.flash("error", `Email ${req.body.email} đã tồn tại!`);
      } else {
        const updatedBy = {
          account_id: res.locals.user.id,
          updatedAt: new Date(),
        };
        if (req.body.password) {
          req.body.password = md5(req.body.password);
        }else{
            delete  req.body.password;
        }
        await Account.updateOne(
          {
            _id: id,
          },
          {
            ...req.body,
            $push: { updatedBy: updatedBy },
          }
        );
        req.flash("success", `Cập nhật thông tin cá nhân thành công!`);
      }
    
      // Điều hướng về url về trang danh sách sản phẩm
      res.redirect(`back`);
};
