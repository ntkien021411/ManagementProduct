const Cart= require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
    if(!req.cookies.cartId){
        //Khi user chưa có giỏ hàng thì tạo mới giỏ hàng
        const cart = new Cart();
        await cart.save();
                                // 1p   1h   1ngay  1 năm
        const expiresTime = 1000 * 60 * 60 *  24 * 365;

        res.cookie("cartId",cart.id,{expires: new Date(Date.now()+expiresTime)});

    }else{
        //Khi đã có giỏ hàng
        const cart = await Cart.findOne({
            _id : req.cookies.cartId
        });
        // cart.totalQuantity = cart.products.reduce((sum , item) => sum + item.quantity, 0); // tổng số lượng của từng sản phẩm
        cart.totalQuantity = cart.products.length; // tổng số sản phẩm

        // console.log(cart.products.length);
        res.locals.miniCart = cart;
    }
    
      
      next();
  };
  
  