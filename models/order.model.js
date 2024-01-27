const mongoose = require('mongoose');

//Tạo model
const orderSchema = new mongoose.Schema({
    // user_id:String,
    cart_id:String,
    userInfo : {
        fullName:String,
        phone:String,
        address:String
    },
    products : [{
        product_id : String,
        price : Number,
        discountPercentage : Number,
        quantity : Number,
    }],
},{
    timestamps : true
});
//Tham số 1 là tên model
//Tham số 2 schema : cấu trúc của dữ liệu để thêm vào db
//Tham số 3 là tên collection(tên table)
const Order = mongoose.model('Order', orderSchema,"orders");
module.exports = Order;
