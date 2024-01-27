const mongoose = require('mongoose');

//Tạo model
const cartSchema = new mongoose.Schema({
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
const Cart = mongoose.model('Cart', cartSchema,"carts");
module.exports = Cart;
