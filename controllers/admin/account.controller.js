const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
const paginationHelper = require("../../helpers/pagination");
var md5 = require("md5");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
// [GET] /admin/accounts/
module.exports.index = async (req, res) => {
 //Nút bấm lọc trạng thái của product
 let filterStatus = filterStatusHelper(req.query);

 //OBJECT BỘ LỌC VÀ TÌM KIẾM data TRONG MONGODB
 let find = {
   deleted: false,
 };

 //BỘ LỌC TRẠNG THÁI SẢN PHẨM
 //http://localhost:3000/admin/products?keyword=Iphone
 if (req.query.status) {
   find.status = req.query.status;
 }

 //TÌM KIẾM SẢN PHẨM THEO TITLE
 let objectSearch = searchHelper(req.query);
 if (objectSearch.regex) {
   find.fullName = objectSearch.regex;
 }
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
  //SẮP XẾP SẢN PHẨM
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
    // console.log(sort);
  } else {
    sort.position = "asc";
  }
  const records = await Account.find(find)
    .select("-password -token")
    .sort(sort)
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
  for (const item of records) {
    //Lấy ra thông tin người tạo
    const userCreated = await Account.findOne({
      _id: item.createdBy.account_id,
    });
    if (userCreated) {
      item.accountFullName = userCreated.fullName;
    }
    //Lấy ra thông tin người cập nhật cuối cùng(1 mảng nhiều ng cập nhật)
    const updatedBy = item.updatedBy.slice(-1)[0];
    if (updatedBy) {
      const userUpdated = await Account.findOne({
        _id: updatedBy.account_id,
      });
      updatedBy.accountFullName = userUpdated.fullName;
    }
  }
  res.render("admin/pages/accounts/index", {
    title: "Danh sách tài khoản",
    records: records,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
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
  const accountExist = await Account.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (accountExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại!`);
    res.redirect(`back`);
  } else {
    req.body.password = md5(req.body.password);
    req.body.createdBy = {
      //res.locals.user.id dùng cả view lẫn controller
      account_id: res.locals.user.id,
    };
    const record = new Account(req.body);
    await record.save();
    req.flash("success", `Tạo mới tài khoản thành công!`);
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
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
    { deleted: true, deletedBy: {
      account_id: res.locals.user.id,
      deletedAt: new Date(),
    } }
  );
  req.flash("success", `Xóa tài khoản thành công!`);
  res.redirect("back");
};

// [PATCH] /admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };
  await Account.updateOne({ _id: id }, { status: status ,  $push: { updatedBy: updatedBy }, });
  req.flash("success", "Cập nhật trạng thái tài khoản thành công!");
  res.redirect("back");
};
// [PATCH] /admin/accounts/change-multi/
// giữa trên form body để dùng req.body
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(",");
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };
  switch (type) {
    case "active":
      await Account.updateMany(
        { _id: { $in: ids } },
        { status: "active", $push: { updatedBy: updatedBy } }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} tài khoản!`
      );
      break;
    case "inactive":
      await Account.updateMany(
        { _id: { $in: ids } },
        { status: "inactive", $push: { updatedBy: updatedBy } }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} tài khoản!`
      );
      break;
    case "delete-all": //xóa mềm
      await Account.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(),
          },
        }
      );
      req.flash("success", `Xóa thành công ${ids.length} tài khoản!`);
      break;
    
  }
  res.redirect("back");
};

