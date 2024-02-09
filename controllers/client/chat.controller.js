const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const upload =require("../../helpers/uploadToCloudinary");
const RoomChat = require("../../models/room-chat.model");
const chatSocket =require("../../sockets/client/chat.socket");
// [GET] /chat/:roomChatId
module.exports.index = async (req, res) => {
  const roomChatId = req.params.roomChatId;

  chatSocket(req,res);
  //Lấy ra data chat
  const chats = await Chat.find({
    room_chat_id : roomChatId,
    deleted:false
  });
  const roomChat = await RoomChat.findOne({
    _id : roomChatId,
    deleted:false
  });
 
  // const userOwner = roomChat.users.find(item => item.user_id == res.locals.user.id);
  for (const chat of chats) {
      const infoUser = await User.findOne({
        _id : chat.user_id
      }).select("fullName");
      chat.infoUser = infoUser;
  }
  // const friendList = res.locals.user.friendList;
  // for (const item of friendList) {
  //   const infoUser = await User.findOne({
  //     _id: item.user_id,
  //   }).select("id avatar  fullName ");
  //   item.infoUser = infoUser;
  // }
  // console.log(chats);
  res.render("client/pages/chat/index", {
    title: "Chat",
    chats : chats,
    roomChat : roomChat,
    // friendList: friendList,
    // userOwner : userOwner,
  });
};
