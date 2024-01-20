const mongoose = require('mongoose');
const generateToken = require("../helpers/generateToken");
//Tạo model
const accountSchema = new mongoose.Schema({
    fullName:String,
    email:String,
    password:String,
    token : {
        type:String,
        default : generateToken.generateRandomString(30)
    },
    phone : String,
    avatar : String,
    role_id: String,
    status:String,
    deleted:{
        type:Boolean,
        default:false
    },
    createdBy: {
        account_id: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
      deletedBy: {
        account_id: String,
        deletedAt: Date,
      },
      updatedBy: [
        {
          account_id: String,
          updatedAt: Date,
        },
      ],
},{
    timestamps : true
});
//Tham số 1 là tên model
//Tham số 2 schema : cấu trúc của dữ liệu để thêm vào db
//Tham số 3 là tên collection(tên table)
const Account = mongoose.model('Account', accountSchema,"accounts");
module.exports = Account;
