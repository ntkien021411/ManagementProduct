const systemConfig = require("../../config/system");
const Product = require("../../models/product.model");
const priceNewProducts = require("../../helpers/product");
// [GET] /
module.exports.index =  async (req, res) => {
  //OBJECT BỘ LỌC VÀ TÌM KIẾM data TRONG MONGODB
  let find = {
    deleted: false,
    feature : 1,
    status : "active"
  };
  
  const products = await Product.find(find).limit(6)
  const newProducts = priceNewProducts.priceNewProducts(products);
  // console.log(newRecords);

  const productsNew = await Product.find({
    deleted: false,
    status : "active"
  }).sort({position : "desc"}).limit(6)
  res.render("client/pages/home/index",{
    title:"Trang chủ",
    productsFeatured :newProducts,
    productsNew :productsNew
  });
};
