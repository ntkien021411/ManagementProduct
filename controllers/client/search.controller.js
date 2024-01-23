const Product = require("../../models/product.model");
const searchHelper = require("../../helpers/search");
const priceNewProducts = require("../../helpers/product");
// [GET] /search?keyword=...
module.exports.index =  async (req, res) => {
  //OBJECT BỘ LỌC VÀ TÌM KIẾM data TRONG MONGODB
  let find = {
    deleted: false,
    status : "active"
  };

  let objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }
  const products = await Product.find(find)
  const newProducts = priceNewProducts.priceNewProducts(products);
  res.render("client/pages/search/index",{
    title:"Kết quả tìm kiếm",
    keyword: objectSearch.keyword,
    products : newProducts
  });
};
