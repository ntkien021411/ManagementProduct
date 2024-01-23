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
    }
    
      
      next();
  };
  
  