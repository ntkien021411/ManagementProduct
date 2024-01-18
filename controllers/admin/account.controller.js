const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
const paginationHelper = require("../../helpers/pagination");
var md5 = require("md5");
// [GET] /admin/accounts/
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  //Total Page :
  let countProducts = await Account.countDocuments(find);
  //PAGINATION
  let objectPagination = paginationHelper(
    req.query,
    {
      limitItem: 6,
      currentPage: 1,
    },
    countProducts
  );
  const records = await Account.find(find)
    .select("-password -token")
    .limit(objectPagination.limitItem) //số phần tử cần lấy cho 1 trang
    .skip(objectPagination.skip);

  for (const record of records) {
    if (record.role_id != "") {
      let role = await Role.findOne({
        _id: record.role_id,
        deleted: false,
      });
      record.role = role;
    }
  }
  res.render("admin/pages/accounts/index", {
    title: "Danh sách tài khoản",
    records: records,
    pagination: objectPagination,
  });
};

// [GET] /admin/accounts/create
module.exports.createAccountsPage = async (req, res) => {
  let find = {
    deleted: false,
  };
  const roles = await Role.find(find);
  res.render("admin/pages/accounts/create", {
    title: "Thêm mới tài khoản",
    roles: roles,
  });
};

// [POST] /admin/accounts/create
module.exports.createAccounts = async (req, res) => {
  const accountExist = Account.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (!accountExist) {
    req.body.password = md5(req.body.password);
    const record = new Account(req.body);
    await record.save();
    req.flash("success", `Tạo mới tài khoản thành công!`);
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  } else {
    req.flash("error", `Email ${req.body.email} đã tồn tại!`);
    res.redirect(`back`);
  }
};

// [GET] /admin/accounts/edit:id
module.exports.editAccountPage = async (req, res) => {
  try {
    let find = {
      deleted: false,
      _id: req.params.id,
    };

    const record = await Account.findOne(find);
    const records = await Role.find({ deleted: false });
    res.render("admin/pages/accounts/edit", {
      title: "Chỉnh sửa tài khoản",
      record: record,
      records: records,
    });
  } catch (error) {
    req.flash("error", `Tài khoản không tồn tại!`);
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

// [PATCH] /admin/accounts/edit:id
module.exports.editAccount = async (req, res) => {
  const id = req.params.id;

  const accountExist = await Account.findOne({
    _id : {$ne: id},
    email: req.body.email,
    deleted: false,
  });
  if (accountExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại!`);
  } else {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    }else{
        delete  req.body.password;
    }
    await Account.updateOne(
      {
        _id: id,
      },
      req.body
    );
    req.flash("success", `Cập nhật tài khoản thành công!`);
  }

  // Điều hướng về url về trang danh sách sản phẩm
  res.redirect(`back`);
};

// [GET] /admin/accounts/detail:id
module.exports.detail = async (req, res) => {
  //   try {
  let find = {
    deleted: false,
    _id: req.params.id,
  };

  const record = await Account.findOne(find).select("-password -token");
  try {
    if (record.role_id != "") {
      let role = await Role.findOne({
        _id: record.role_id,
        deleted: false,
      });
      record.role = role;
      //   console.log(record);
    }
    res.render("admin/pages/accounts/detail", {
      title: record.fullName,
      record: record,
    });
  } catch (error) {
    req.flash("error", `Tài khoản không tồn tại!`);
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

//[DELETE] /admin/accounts/delete/:id
module.exports.deleteAccount = async (req, res) => {
  const id = req.params.id;
  await Account.updateOne(
    { _id: id },
    { deleted: true, deletedAt: new Date() }
  );
  req.flash("success", `Xóa tài khoản thành công!`);
  res.redirect("back");
};

// [PATCH] /admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Account.updateOne({ _id: id }, { status: status });
  req.flash("success", "Cập nhật trạng thái tài khoản thành công!");
  res.redirect("back");
};
//
