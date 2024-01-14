const mongoose = require('mongoose');

//Tạo model
const roleSchema = new mongoose.Schema({
    title:String,
    description:String,
    permissions : { // nhóm quyền
        type:Array,
        default : []
    },
    deleted:{
        type:Boolean,
        default:false
    },
    deletedAt:Date
},{
    timestamps : true
});
//Tham số 1 là tên model
//Tham số 2 schema : cấu trúc của dữ liệu để thêm vào db
//Tham số 3 là tên collection(tên table)
const Role = mongoose.model('Role', roleSchema,"roles");
module.exports = Role;
