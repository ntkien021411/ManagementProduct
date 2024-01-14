const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

// [GET] /admin/roles/
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Role.find(find);
  res.render("admin/pages/roles/index", {
    title: "Nhóm quyền",
    records: records,
  });
};

// [GET] /admin/roles/create
module.exports.createRolePage = async (req, res) => {
  res.render("admin/pages/roles/create", {
    title: "Tạo nhóm quyền",
  });
};

// [POST] /admin/roles/create
module.exports.createRole = async (req, res) => {
  const record = new Role(req.body);
  await record.save();
  req.flash("success", `Tạo mới nhóm quyền thành công!`);
  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

// [GET] /admin/roles/edit:id
module.exports.edit = async (req, res) => {
  try {
    let find = {
      deleted: false,
      _id: req.params.id,
    };

    const record = await Role.findOne(find);
    res.render("admin/pages/roles/edit", {
      title: "Chỉnh sửa nhóm quyền",
      record: record,
    });
  } catch (error) {
    req.flash("error", `Nhóm quyền không tồn tại!`);
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [PATCH] /admin/roles/edit:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  try {
    await Role.updateOne(
      {
        _id: id,
      },
      req.body
    );
    req.flash("success", `Cập nhật nhóm quyền thành công!`);
  } catch (error) {
    req.flash("error", `Cập nhật nhóm quyền thất bại!`);
  }
  // Điều hướng về url về trang danh sách sản phẩm
  res.redirect(`back`);
};

// [GET] /admin/roles/detail:id
module.exports.detail = async (req, res) => {
  try {
    let find = {
      deleted: false,
      _id: req.params.id,
    };

    const record = await Role.findOne(find);

    res.render("admin/pages/roles/detail", {
      title: record.title,
      record: record,
    });
  } catch (error) {
    req.flash("error", `Nhóm quyền không tồn tại!`);
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

//[DELETE] /admin/roles/delete/:id
module.exports.deleteOnItem = async (req, res) => {
    const id = req.params.id;
    await Role.updateOne(
      { _id: id },
      { deleted: true, deletedAt: new Date() }
    );
    req.flash("success", `Xóa nhóm quyền thành công!`);
    res.redirect("back");
  };