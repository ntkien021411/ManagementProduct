const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const upload =require("../../helpers/uploadToCloudinary");

const chatSocket =require("../../sockets/client/chat.socket");
// [GET] /rooms-chat/
module.exports.index = async (req, res) => {
//   const roomChatId = req.params.roomChatId;

//   chatSocket(req,res);
//   //Lấy ra data chat
//   const chats = await Chat.find({
//     room_chat_id : roomChatId,
//     deleted:false
//   });
//   for (const chat of chats) {
//       const infoUser = await User.findOne({
//         _id : chat.user_id
//       }).select("fullName");
//       chat.infoUser = infoUser;
//   }
  // console.log(chats);
  res.render("client/pages/rooms-chat/index", {
    title: "Danh sách phòng",
  });
};
