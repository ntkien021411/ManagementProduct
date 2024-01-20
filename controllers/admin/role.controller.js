const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
// [GET] /admin/roles/
module.exports.index = async (req, res) => {
  //Nút bấm lọc trạng thái của product
  let filterStatus = filterStatusHelper(req.query);

  //OBJECT BỘ LỌC VÀ TÌM KIẾM data TRONG MONGODB
  let find = {
    deleted: false,
  };


  //TÌM KIẾM SẢN PHẨM THEO TITLE
  let objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  //Total Page :
  let countProducts = await Role.countDocuments(find);
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
  const records = await Role.find(find)
    .sort(sort)
    .limit(objectPagination.limitItem) //số phần tử cần lấy cho 1 trang
    .skip(objectPagination.skip); //Bỏ qua bnh sản phẩm để bắt đầu lấy limit;

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
  res.render("admin/pages/roles/index", {
    title: "Nhóm quyền",
    records: records,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [GET] /admin/roles/create
module.exports.createRolePage = (req, res) => {
  res.render("admin/pages/roles/create", {
    title: "Thêm mới nhóm quyền",
  });
};

// [POST] /admin/roles/create
module.exports.createRole = async (req, res) => {
  req.body.createdBy = {
    //res.locals.user.id dùng cả view lẫn controller
    account_id: res.locals.user.id,
  };
  const record = new Role(req.body);
  await record.save();
  req.flash("success", `Tạo mới nhóm quyền thành công!`);
  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

// [GET] /admin/roles/edit:id
module.exports.editPage = async (req, res) => {
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
module.exports.editRole = async (req, res) => {
  const id = req.params.id;
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };
  try {
    await Role.updateOne(
      {
        _id: id,
      },
      {
        ...req.body,
        $push: { updatedBy: updatedBy },
      }
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
module.exports.deleteRole = async (req, res) => {
  const id = req.params.id;
  await Role.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: new Date(),
      },
    }
  );
  req.flash("success", `Xóa nhóm quyền thành công!`);
  res.redirect("back");
};

//[GET] /admin/roles/permission
module.exports.permissions = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Role.find(find);
  res.render("admin/pages/roles/permissions", {
    title: "Phân quyền",
    records: records,
  });
};

//[PATCH] /admin/roles/permission
module.exports.changePermissions = async (req, res) => {
  try {
    const permissions = JSON.parse(req.body.permissions);
    for (const item of permissions) {
      await Role.updateOne(
        {
          _id: item.id,
        },
        {
          permissions: item.permissions,
        }
      );
    }

    req.flash("success", `Phân quyền thành công!`);
  } catch (error) {
    req.flash("error", `Phân quyền thất bại!`);
  }
  res.redirect(`back`);
};
