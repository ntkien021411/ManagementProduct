const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const upload =require("../../helpers/uploadToCloudinary");

const chatSocket =require("../../sockets/client/chat.socket");
// [GET] /chat
module.exports.index = async (req, res) => {
  chatSocket(res);
  //Lấy ra data chat
  const chats = await Chat.find({
    deleted:false
  });
  for (const chat of chats) {
      const infoUser = await User.findOne({
        _id : chat.user_id
      }).select("fullName");
      chat.infoUser = infoUser;
  }
  // console.log(chats);
  res.render("client/pages/chat/index", {
    title: "Chat",
    chats : chats
  });
};
