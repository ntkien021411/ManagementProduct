const mongoose = require('mongoose');
const generateToken = require("../helpers/generateToken");
//Tạo model
const userSchema = new mongoose.Schema({
    fullName:String,
    email:String,
    password:String,
    tokenUser : {
        type:String,
        default : generateToken.generateRandomString(50)
    },
    phone : String,
    avatar : String,
    friendList:[ //Danh sách bạn bè của user và những box chat với bạn bè
    {
      userId : String,
      room_chat_id : String
    }
    ],
    acceptFriends : Array, //Danh sách lời mời kết bạn gửi tới user
    requestFriends : Array, // Danh sách nhừng yêu cầu kết bạn gửi đi của user 
    status:{
        type:String,
        default : "active"
    },
    deleted:{
        type:Boolean,
        default:false
    },
    createdBy: {
        user_id: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
      deletedBy: {
        user_id: String,
        deletedAt: Date,
      },
      updatedBy: [
        {
          user_id: String,
          updatedAt: Date,
        },
      ],
},{
    timestamps : true
});
//Tham số 1 là tên model
//Tham số 2 schema : cấu trúc của dữ liệu để thêm vào db
//Tham số 3 là tên collection(tên table)
const User = mongoose.model('User', userSchema,"users");
module.exports = User;
