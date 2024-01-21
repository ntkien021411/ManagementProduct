const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const createTreeCategory = require("../../helpers/createTreeCategory");

// [GET] /
module.exports.index =  async (req, res) => {
  
  // console.log(newRecords);
  res.render("client/pages/home/index",{
    title:"Trang chủ",
  });
};
