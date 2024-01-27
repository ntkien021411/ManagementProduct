const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const priceNewProduct = require("../../helpers/product");
// [POST] /cart/add/:productId
module.exports.add = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);

  const cart = await Cart.findOne({
    _id: cartId,
  });
  const exitsProductInCart = cart.products.find(
    (item) => item.product_id == productId
  );
  if (exitsProductInCart) {
    //Tồn tại sản phẩm đó trong giỏ hàng thì cập nhật quantity
    const newQuantity = quantity + exitsProductInCart.quantity;
    await Cart.updateOne(
      {
        _id: cartId, // giỏ hàng hiện tại
        "products.product_id": productId, // product trong mảng product trong giỏ hàng
      },
      {
        $set: {
          "products.$.quantity": newQuantity,
        },
      },
    );
    req.flash("success", `Thêm sản phẩm vào giỏ hàng thành công!`);
  } else {
    const objectCart = {
      product_id: productId,
      quantity: quantity,
    };
    await Cart.updateOne({ _id: cartId }, { $push: { products: objectCart } });
    req.flash("success", `Thêm sản phẩm vào giỏ hàng thành công!`);
  }
  res.redirect(`back`);
};

// [GET] /cart
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({
    _id: cartId,
  });
  if(cart.products.length > 0){
    for (const item of cart.products) {
      const productId = item.product_id;

      const productInfo = await Product.findOne({
        _id : productId
      });

      productInfo.priceNew = priceNewProduct.priceNewProduct(productInfo)
      item.productInfo = productInfo;
      item.totalPrice = productInfo.priceNew* item.quantity
    }

  }
  cart.totalPrice= cart.products.reduce((sum,item)  => sum+ item.totalPrice, 0)
  res.render("client/pages/cart/index",{
    title:"Giỏ hàng",
    carts : cart
  });
};


// [POST] /cart/delete/:productId
module.exports.delete = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;

   await Cart.updateOne({
    _id: cartId,
  },{
    "$pull" :{products : {"product_id" : productId}}
  });
  req.flash("success", `Xóa sản phẩm ra khỏi giỏ hàng thành công!`);
  res.redirect(`back`);
};