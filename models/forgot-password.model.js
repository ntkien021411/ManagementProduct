const mongoose = require('mongoose');
const generateToken = require("../helpers/generateToken");
//Tạo model
const forgotPasswordSchema = new mongoose.Schema({
    email:String,
    otp:String,
    expireAt : {
        type:Date,
        expires: 180 //tgian hiện tại + thêm 180s => 3p
    },
   
},{
    timestamps : true
});
//Tham số 1 là tên model
//Tham số 2 schema : cấu trúc của dữ liệu để thêm vào db
//Tham số 3 là tên collection(tên table)
const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema,"forgot-password");
module.exports = ForgotPassword;
