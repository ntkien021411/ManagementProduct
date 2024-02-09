const mongoose = require('mongoose');

//Tạo model
const roomChatSchema = new mongoose.Schema({
    title:String,
    avatar:String,
    typeRoom:String,
    status:String,
    users:[{
        user_id:String,
        role:String,
    }],
    deleted:{
        type:Boolean,
        default:false
    },
    deletedAt: Date,
},{
    timestamps : true
});
//Tham số 1 là tên model
//Tham số 2 schema : cấu trúc của dữ liệu để thêm vào db
//Tham số 3 là tên collection(tên table)
const RoomChat = mongoose.model('RoomChat', roomChatSchema,"rooms-chat");
module.exports = RoomChat;
