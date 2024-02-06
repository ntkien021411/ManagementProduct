const User = require("../../models/user.model");
const generateToken = require("../../helpers/generateToken");
const systemConfig = require("../../config/system");
var md5 = require("md5");
const paginationHelper = require("../../helpers/pagination");
const Account = require("../../models/account.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
// [GET] /admin/users/
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
    let countProducts = await User.countDocuments(find);
    //PAGINATION
    let objectPagination = paginationHelper(
      req.query,
      {
        limitItem: 3,
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
    const records = await User.find(find)
      .select("-password -token")
      .sort(sort)
      .limit(objectPagination.limitItem) //số phần tử cần lấy cho 1 trang
      .skip(objectPagination.skip);
  
   
    for (const item of records) {
      //Lấy ra thông tin người tạo
      const userCreated = await Account.findOne({
        _id: item.createdBy.user_id,
      });
      if (userCreated) {
        item.accountFullName = userCreated.fullName;
      }
      //Lấy ra thông tin người cập nhật cuối cùng(1 mảng nhiều ng cập nhật)
      const updatedBy = item.updatedBy.slice(-1)[0];
      if (updatedBy) {
        const userUpdated = await Account.findOne({
          _id: updatedBy.user_id,
        });
        updatedBy.accountFullName = userUpdated.fullName;
      }
    }
    res.render("admin/pages/users/index", {
      title: "Danh sách tài khoản người dùng",
      records: records,
      filterStatus: filterStatus,
      keyword: objectSearch.keyword,
      pagination: objectPagination,
    });
  };
  
  // [GET] /admin/users/create
  module.exports.createAccountsPage = async (req, res) => {
   
    res.render("admin/pages/users/create", {
      title: "Thêm mới tài khoản người dùng",
    });
  };
  
  // [POST] /admin/users/create
  module.exports.createAccounts = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (permissions.includes("client_create")) {
      const accountExist = await User.findOne({
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
          user_id: res.locals.user.id,
        };
        const record = new User(req.body);
        await record.save();
        req.flash("success", `Tạo mới tài khoản người dùng thành công!`);
        res.redirect(`${systemConfig.prefixAdmin}/users`);
      }
    } else {
      res.send("403");
      return;
    }
  };
  
  // [GET] /admin/users/edit:id
  module.exports.editAccountPage = async (req, res) => {
    try {
      let find = {
        deleted: false,
        _id: req.params.id,
      };
  
      const record = await User.findOne(find);
      res.render("admin/pages/users/edit", {
        title: "Chỉnh sửa tài khoản người dùng",
        record: record,
      });
    } catch (error) {
      req.flash("error", `Tài khoản không tồn tại!`);
      res.redirect(`${systemConfig.prefixAdmin}/users`);
    }
  };
  
  // [PATCH] /admin/users/edit:id
  module.exports.editAccount = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (permissions.includes("client_edit")) {
      const id = req.params.id;
  
      const accountExist = await User.findOne({
        _id: { $ne: id },
        email: req.body.email,
        deleted: false,
      });
      if (accountExist) {
        req.flash("error", `Email ${req.body.email} đã tồn tại!`);
      } else {
        const updatedBy = {
            user_id: res.locals.user.id,
          updatedAt: new Date(),
        };
        if (req.body.password) {
          req.body.password = md5(req.body.password);
        } else {
          delete req.body.password;
        }
        await User.updateOne(
          {
            _id: id,
          },
          {
            ...req.body,
            $push: { updatedBy: updatedBy },
          }
        );
        req.flash("success", `Cập nhật tài khoản người dùng thành công!`);
      }
  
      // Điều hướng về url về trang danh sách sản phẩm
      res.redirect(`back`);
    } else {
      res.send("403");
      return;
    }
  };
  
  // [GET] /admin/users/detail:id
  module.exports.detail = async (req, res) => {
    //   try {
    let find = {
      deleted: false,
      _id: req.params.id,
    };
  
    const record = await User.findOne(find).select("-password -token");
    try {
     
      res.render("admin/pages/users/detail", {
        title: record.fullName,
        record: record,
      });
    } catch (error) {
      req.flash("error", `Tài khoản không tồn tại!`);
      res.redirect(`${systemConfig.prefixAdmin}/users`);
    }
  };
  
  //[DELETE] /admin/users/delete/:id
  module.exports.deleteAccount = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (permissions.includes("client_delete")) {
      const id = req.params.id;
      await User.updateOne(
        { _id: id },
        {
          deleted: true,
          deletedBy: {
            user_id: res.locals.user.id,
            deletedAt: new Date(),
          },
        }
      );
      req.flash("success", `Xóa tài khoản người dùng thành công!`);
      res.redirect("back");
    } else {
      res.send("403");
      return;
    }
  };
  
  // [PATCH] /admin/users/change-status/:status/:id
  module.exports.changeStatus = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (permissions.includes("client_edit")) {
      const status = req.params.status;
      const id = req.params.id;
      const updatedBy = {
        user_id: res.locals.user.id,
        updatedAt: new Date(),
      };
      await User.updateOne(
        { _id: id },
        { status: status, $push: { updatedBy: updatedBy } }
      );
      req.flash("success", "Cập nhật trạng thái tài khoản người dùng thành công!");
      res.redirect("back");
    } else {
      res.send("403");
      return;
    }
  };
  // [PATCH] /admin/users/change-multi/
  // giữa trên form body để dùng req.body
  module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(",");
    const updatedBy = {
      user_id: res.locals.user.id,
      updatedAt: new Date(),
    };
    const permissions = res.locals.role.permissions;
    switch (type) {
      case "active":
        if (permissions.includes("client_edit")) {
          await User.updateMany(
            { _id: { $in: ids } },
            { status: "active", $push: { updatedBy: updatedBy } }
          );
          req.flash(
            "success",
            `Cập nhật trạng thái thành công ${ids.length} tài khoản người dùng!`
          );
          break;
        } else {
          res.send("403");
          return;
        }
      case "inactive":
        if (permissions.includes("client_edit")) {
          await User.updateMany(
            { _id: { $in: ids } },
            { status: "inactive", $push: { updatedBy: updatedBy } }
          );
          req.flash(
            "success",
            `Cập nhật trạng thái thành công ${ids.length} tài khoản người dùng!`
          );
          break;
        } else {
          res.send("403");
          return;
        }
      case "delete-all": //xóa mềm
        if (permissions.includes("client_delete")) {
          await User.updateMany(
            { _id: { $in: ids } },
            {
              deleted: true,
              deletedBy: {
                user_id: res.locals.user.id,
                deletedAt: new Date(),
              },
            }
          );
          req.flash("success", `Xóa thành công ${ids.length} tài khoản người dùng!`);
          break;
        } else {
            res.send("403");
            return;
        }
    }
    res.redirect("back");
  };
  