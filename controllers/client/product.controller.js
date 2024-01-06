const Product = require("../../models/product.model");
// [GET] /products
module.exports.index = async (req, res) => {
  // find với Aggregation Operations
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "asc" });

  const newProducts = products.map((item) => {
    item.priceNew = (
      (item.price * (100 - item.discountPercentage)) /
      100
    ).toFixed(0);
    return item;
  });
  // console.log(products);
  res.render("client/pages/products/index", {
    title: "Danh sách sản phẩm",
    products: newProducts,
  });
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
