const Product = require("../../models/product.model");
const priceNewProducts = require("../../helpers/product");
const ProductCategory = require("../../models/product-category.model");
const subCategory = require("../../helpers/products-category");
// [GET] /products
module.exports.index = async (req, res) => {
  // find với Aggregation Operations
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });
  const newProducts = priceNewProducts.priceNewProducts(products);
  // console.log(products);
  res.render("client/pages/products/index", {
    title: "Danh sách sản phẩm",
    products: newProducts,
  });
};

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  const category = await ProductCategory.findOne({
    slug : req.params.slugCategory,
    deleted : false,
    status : "active",
  });
  try {

   const listSubCategory = await subCategory.getSubCategory(category.id);
    const listSubCategoryId = listSubCategory.map(item => item.id);
    // console.log(listSubCategoryId);
    const products = await Product.find({
      deleted: false,
      product_category_id:{$in : [category.id,...listSubCategoryId]}
    }).sort({ position: "desc" });

    const newProducts = priceNewProducts.priceNewProducts(products);
    res.render("client/pages/products/index", {
      title: category.title,
      products: newProducts,
    });
  } catch (error) {
    res.send("404")
  }
};
// [GET] /products/:slug
module.exports.detail = async (req, res) => {

  try {
    let find = {
      deleted: false,
      slug: req.params.slug,
      status:"active"
    };

    const product = await Product.findOne(find);

    res.render("client/pages/products/detail", {
      title: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(`/products`);
  }
};
