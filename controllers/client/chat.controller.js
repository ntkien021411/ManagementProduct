const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
// [GET] /chat
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;

  //Socket.IO
  _io.once("connection", (socket) => {
    //người dùng gửi tin nhắn
    socket.on("CLIENT_SEND_MESSAGE",async (content) => {
        //Lưu vào database
      const chat = new Chat(
          {
            user_id: userId,
          content: content
          }
        );
        await chat.save();


        //Trả data chat về client
        _io.emit("SERVER_RETURN_MESSAGE" ,{
            userId : userId,
            fullName : fullName,
            content : content
        } )
    });

    // người dùng đánh máy 
    socket.on("CLIENT_SEND_TYPING",async (type) => {
      
      socket.broadcast.emit('SERVER_RETURN_TYPING', {
        userId : userId,
        fullName : fullName,
        type :type
    });

    });

  });

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
