const ProductCategory = require("../../models/product-category.model");
const Product = require("../../models/product.model");
const Account = require("../../models/account.model");
const User = require("../../models/user.model");
const Order =  require("../../models/order.model");
const Post = require("../../models/post.model");
// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
  const statistic = {
    categoryProduct: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    product: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    account: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    user: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    blog: {
      total: 0,
      active: 0,
      inactive: 0,
    },
  };
  statistic.categoryProduct.total = await ProductCategory.countDocuments({
    deleted: false,
  });
  statistic.categoryProduct.active = await ProductCategory.countDocuments({
    deleted: false,
    status:"active"
  });
  statistic.categoryProduct.inactive = await ProductCategory.countDocuments({
    deleted: false,
    status:"inactive"
  });

  statistic.product.total = await Product.countDocuments({
    deleted: false,
  });
  statistic.product.active = await Product.countDocuments({
    deleted: false,
    status:"active"
  });
  statistic.product.inactive = await Product.countDocuments({
    deleted: false,
    status:"inactive"
  });
  
  statistic.account.total = await Account.countDocuments({
    deleted: false,
  });
  statistic.account.active = await Account.countDocuments({
    deleted: false,
    status:"active"
  });
  statistic.account.inactive = await Account.countDocuments({
    deleted: false,
    status:"inactive"
  });

  statistic.user.total = await User.countDocuments({
    deleted: false,
  });
  statistic.user.active = await User.countDocuments({
    deleted: false,
    status:"active"
  });
  statistic.user.inactive = await User.countDocuments({
    deleted: false,
    status:"inactive"
  });

  statistic.blog.total = await Post.countDocuments({
    deleted: false,
  });
  statistic.blog.active = await Post.countDocuments({
    deleted: false,
    status:"active"
  });
  statistic.blog.inactive = await Post.countDocuments({
    deleted: false,
    status:"inactive"
  });


  res.render("admin/pages/dashboard/index", {
    title: "Trang tổng quan",
    statistic: statistic,
  });
};
