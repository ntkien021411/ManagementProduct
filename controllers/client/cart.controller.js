const Cart = require("../../models/cart.model");

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
