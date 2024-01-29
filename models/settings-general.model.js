const mongoose = require('mongoose');

//Tạo model
const settingGeneralSchema = new mongoose.Schema({
    websiteName:String,
    logo:String,
    phone:String,
    email:String,
    address:String,
    copyright:String,
},{
    timestamps : true
});
//Tham số 1 là tên model
//Tham số 2 schema : cấu trúc của dữ liệu để thêm vào db
//Tham số 3 là tên collection(tên table)
const SettingGeneral = mongoose.model('SettingGeneral', settingGeneralSchema,"settings-general");
module.exports = SettingGeneral;
