const PostCategory = require("../../models/post-category.model");
const systemConfig = require("../../config/system");
const searchHelper = require("../../helpers/search");
// const paginationHelper = require("../../helpers/pagination");
const filterStatusHelper = require("../../helpers/filterStatus");
const createTreeCategory = require("../../helpers/createTreeCategory");
const Account = require("../../models/account.model");
// [GET] /admin/posts-category/
module.exports.index = async (req, res) => {
  //   // BUTTON STATUS
  let filterStatus = filterStatusHelper(req.query);

  //   //  DEFAULT VARIABLE SEARCH DATABASE
  let find = {
    deleted: false,
  };

  //   // LỌC STATUS
  if (req.query.status) {
    find.status = req.query.status;
  }
  // //TÌM KIẾM DANH MỤC SẢN PHẨM THEO TITLE
  let objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }
  //   // // //Total Page :
  //   // let countProducts = await ProductCategory.countDocuments(find);
  //   // //PAGINATION OBJECT
  //   // let objectPagination = paginationHelper(
  //   //   req.query,
  //   //   {
  //   //     limitItem: 6,
  //   //     currentPage: 1,
  //   //   },
  //   //   countProducts
  //   // );

  //   //SẮP XẾP DANH MỤC SẢN PHẨM
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
    // console.log(sort);
  } else {
    //DEFAULT ASC BY POSITION
    sort.position = "asc";
  }
  //trả về 1 mảng các object item cha với thêm 1 thuộc tính là
  // mảng các item con

  // console.log(find);
  // console.log(sort);
  const record = await PostCategory.find(find).sort(sort);
  // .limit(objectPagination.limitItem) //số phần tử cần lấy cho 1 trang
  // .skip(objectPagination.skip);
  for (const item of record) {
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
  const newRecords = createTreeCategory.createTree(record);
  res.render("admin/pages/posts-category/index", {
    title: "Danh mục bài viết",
    records: newRecords,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    // pagination: objectPagination,
  });
};
// [GET] /admin/posts-category/create
module.exports.createPagePostCategory = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await PostCategory.find(find);
  const newRecords = createTreeCategory.createTree(records);
  // console.log(newRecords);

  res.render("admin/pages/posts-category/create", {
    title: "Thêm mới danh mục bài viết",
    records: newRecords,
  });
};
// [POST] /admin/posts-category/createXã hội
module.exports.createPostCategory = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions.includes("posts-category_create")) {
    req.body.createdBy = {
      //res.locals.user.id dùng cả view lẫn controller
      account_id: res.locals.user.id,
    };
    // console.log(req.body);
    const record = new PostCategory(req.body);
    await record.save();

    req.flash("success", `Tạo mới danh mục bài viết thành công!`);
    res.redirect(`${systemConfig.prefixAdmin}/posts-category`);
  } else {
    res.send("403");
    return;
  }
};

// [PATCH] /admin/posts-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions.includes("posts-category_edit")) {
    const status = req.params.status;
    const id = req.params.id;
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };
    await PostCategory.updateOne(
      { _id: id },
      { status: status, $push: { updatedBy: updatedBy } }
    );
    req.flash("success", "Cập nhật trạng thái danh mục bài viết thành công!");
    res.redirect("back");
  } else {
    res.send("403");
    return;
  }
};

// [PATCH] /admin/posts-category/change-multi/
// giữa trên form body để dùng req.body
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(",");
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };
  const permissions = res.locals.role.permissions;

  switch (type) {
    case "active":
      if (permissions.includes("posts-category_edit")) {
        await PostCategory.updateMany(
          { _id: { $in: ids } },
          { status: "active", $push: { updatedBy: updatedBy } }
        );
        req.flash(
          "success",
          `Cập nhật trạng thái thành công ${ids.length} danh mục bài viết`
        );
        break;
      } else {
        res.send("403");
        return;
      }
    case "inactive":
      if (permissions.includes("posts-category_edit")) {
        await PostCategory.updateMany(
          { _id: { $in: ids } },
          { status: "inactive", $push: { updatedBy: updatedBy } }
        );
        req.flash(
          "success",
          `Cập nhật trạng thái  thành công ${ids.length} danh mục bài viết`
        );
        break;
      } else {
        res.send("403");
        return;
      }
    case "delete-all": //xóa mềm
      if (permissions.includes("posts-category_delete")) {
        await PostCategory.updateMany(
          { _id: { $in: ids } },
          {
            deleted: true,
            deletedBy: {
              account_id: res.locals.user.id,
              deletedAt: new Date(),
            },
          }
        );
        req.flash("success", `Xóa thành công ${ids.length} danh mục bài viết!`);
        break;
      } else {
        res.send("403");
        return;
      }
  }
  res.redirect("back");
};

//[DELETE] /admin/posts-category/delete/:id
module.exports.deleteOnItem = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions.includes("posts-category_delete")) {
    const id = req.params.id;
    //Xóa mềm là chỉ update trường delete bằng true
    // cập nhật thêm thời gian xóa là thời gian user bấm nút delete(thời gian hiện tại)
    await PostCategory.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedBy: {
          account_id: res.locals.user.id,
          deletedAt: new Date(),
        },
      }
    );
    req.flash("success", `Xóa danh mục bài viết thành công!`);
    res.redirect("back");
  } else {
    res.send("403");
    return;
  }
};

// [GET] /admin/posts-category/edit:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    let find = {
      deleted: false,
      _id: id,
    };

    const records = await PostCategory.find({
      deleted: false,
    });
    const newRecords = createTreeCategory.createTree(records);

    const postCategory = await PostCategory.findOne(find);
    res.render("admin/pages/posts-category/edit", {
      title: "Chỉnh sửa danh mục bài viết",
      postCategory: postCategory,
      records: newRecords,
    });
  } catch (error) {
    req.flash("error", `Danh mục bài viết không tồn tại!`);
    res.redirect(`${systemConfig.prefixAdmin}/posts-category`);
  }
};

// [PATCH] /admin/posts-category/edit:id
module.exports.editPatch = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions.includes("posts-category_edit")) {
    const id = req.params.id;

    if (id == req.body.parent_id) {
      req.body.parent_id = "";
    }
    try {
      const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date(),
      };
      await PostCategory.updateOne(
        {
          _id: id,
        },
        {
          ...req.body,
          $push: { updatedBy: updatedBy },
        }
      );
      req.flash("success", `Cập nhật danh mục bài viết thành công!`);
    } catch (error) {
      req.flash("error", `Cập nhật danh mục thất bại!`);
    }
    // Điều hướng về url về trang danh sách sản phẩm
    res.redirect(`back`);
  } else {
    res.send("403");
    return;
  }
};

// [GET] /admin/posts-category/detail:id
module.exports.detail = async (req, res) => {
  try {
    let find = {
      deleted: false,
      _id: req.params.id,
    };

    const postCategory = await PostCategory.findOne(find);
    // const categoryParent = await ProductCategory.findOne({
    //   deleted: false,
    //   _id: productCategory.parent_id,
    // });
    res.render("admin/pages/posts-category/detail", {
      title: postCategory.title,
      postCategory: postCategory,
      // categoryParent : categoryParent
    });
  } catch (error) {
    req.flash("error", `Danh mục bài viết không tồn tại!`);
    res.redirect(`${systemConfig.prefixAdmin}/posts-category`);
  }
};
