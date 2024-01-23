const mongoose = require('mongoose');

//Tạo model
const cartShema = new mongoose.Schema({
    user_id:String,
    products : [{
        product_id : String,
        quantity : Number,
    }],
},{
    timestamps : true
});
//Tham số 1 là tên model
//Tham số 2 schema : cấu trúc của dữ liệu để thêm vào db
//Tham số 3 là tên collection(tên table)
const Cart = mongoose.model('Cart', cartShema,"carts");
module.exports = Cart;
