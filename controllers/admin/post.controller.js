const Post = require("../../models/post.model");
const PostCategory = require("../../models/post-category.model");
const systemConfig = require("../../config/system");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const filterStatusHelper = require("../../helpers/filterStatus");
const createTreeCategory = require("../../helpers/createTreeCategory");
const Account = require("../../models/account.model");
// [GET] /admin/posts/
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
  // // //Total Page :
  let countProducts = await Post.countDocuments(find);
  // //PAGINATION OBJECT
  let objectPagination = paginationHelper(
    req.query,
    {
      limitItem: 6,
      currentPage: 1,
    },
    countProducts
  );

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
  const record = await Post.find(find)
    .sort(sort)
    .limit(objectPagination.limitItem) //số phần tử cần lấy cho 1 trang
    .skip(objectPagination.skip);
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
  res.render("admin/pages/posts/index", {
    title: "Danh sách bài viết",
    records: record,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};
// [GET] /admin/posts/create
module.exports.createPagePost = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await PostCategory.find(find);
  const newRecords = createTreeCategory.createTree(records);
  // console.log(newRecords);

  res.render("admin/pages/posts/create", {
    title: "Thêm mới bài viết",
    records: newRecords,
  });
};
// [POST] /admin/posts/create
module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    const countProducts = await Post.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(res.body.position);
  }
  req.body.createdBy = {
    //res.locals.user.id dùng cả view lẫn controller
    account_id: res.locals.user.id,
  };
  // console.log(req.body);
  const record = new Post(req.body);
  await record.save();

  req.flash("success", `Tạo mới bài viết thành công!`);
  res.redirect(`${systemConfig.prefixAdmin}/posts`);
};

// [PATCH] /admin/posts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };
  await Post.updateOne(
    { _id: id },
    { status: status, $push: { updatedBy: updatedBy } }
  );
  req.flash("success", "Cập nhật trạng thái bài viết thành công!");
  res.redirect("back");
};

// [PATCH] /admin/posts/change-multi/
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
      await Post.updateMany(
        { _id: { $in: ids } },
        { status: "active", $push: { updatedBy: updatedBy } }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} bài viết`
      );
      break;
    case "inactive":
      await Post.updateMany(
        { _id: { $in: ids } },
        { status: "inactive", $push: { updatedBy: updatedBy } }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái  thành công ${ids.length} bài viết`
      );
      break;
    case "delete-all": //xóa mềm
      await Post.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(),
          },
        }
      );
      req.flash("success", `Xóa thành công ${ids.length} bài viết!`);
      break;
    case "change-position": //Thay đổi vị trí
      for (const item of ids) {
        // phần tử gồm 1 chuỗi id-position
        let [id, position] = item.split("-");
        position = parseInt(position);
        /// cập nhật vị trí của từng id
        await Post.updateOne(
          { _id: id },
          {
            position: position,
            $push: { updatedBy: updatedBy },
          }
        );
      }
      req.flash(
        "success",
        `Cập nhật vị trí thành công ${ids.length} bài viết!`
      );
      break;
  }
  res.redirect("back");
};

//[DELETE] /admin/posts/delete/:id
module.exports.deleteOnItem = async (req, res) => {
  const id = req.params.id;
  //Xóa mềm là chỉ update trường delete bằng true
  // cập nhật thêm thời gian xóa là thời gian user bấm nút delete(thời gian hiện tại)
  await Post.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: new Date(),
      },
    }
  );
  req.flash("success", `Xóa bài viết thành công!`);
  res.redirect("back");
};

// [GET] /admin/posts/edit:id
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

    const post = await Post.findOne(find);
    res.render("admin/pages/posts/edit", {
      title: "Chỉnh sửa bài viết",
      post: post,
      records: newRecords,
    });
  } catch (error) {
    req.flash("error", `Bài viết không tồn tại!`);
    res.redirect(`${systemConfig.prefixAdmin}/posts`);
  }
};

// [PATCH] /admin/posts/edit:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };
    await Post.updateOne(
      {
        _id: id,
      },
      {
        ...req.body,
        $push: { updatedBy: updatedBy },
      }
    );
    req.flash("success", `Cập nhật bài viết thành công!`);
  } catch (error) {
    req.flash("error", `Cập nhật bài viết thất bại!`);
  }
  // Điều hướng về url về trang danh sách sản phẩm
  res.redirect(`back`);
};

// [GET] /admin/posts/detail:id
module.exports.detail = async (req, res) => {
  try {
    let find = {
      deleted: false,
      _id: req.params.id,
    };

    const post = await Post.findOne(find);
    const postCategory = await PostCategory.findOne({
        _id: post.post_category_id,
      });
    res.render("admin/pages/posts/detail", {
      title: post.title,
      post: post,
      postCategory:postCategory
    });

  } catch (error) {
    req.flash("error", `Bài viết không tồn tại!`);
    res.redirect(`${systemConfig.prefixAdmin}/posts`);
  }
};
