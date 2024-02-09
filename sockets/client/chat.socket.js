const Chat = require("../../models/chat.model");
const upload =require("../../helpers/uploadToCloudinary");
module.exports =async (req,res) =>{
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;
    const roomChatId = req.params.roomChatId;
     //Socket.IO
  _io.once("connection", (socket) => {
    //Tạo room cho 2 người
    socket.join(roomChatId);
    //người dùng gửi tin nhắn
    socket.on("CLIENT_SEND_MESSAGE",async (data) => {

      // console.log(data.images);

      let images = [];

      for (const imageBuffer of data.images) {
        const link = await upload.uploadToCloudinary(imageBuffer);
        images.push(link);
      }
        //Lưu vào database
      const chat = new Chat(
          {
          user_id: userId,
          room_chat_id:roomChatId,
          content: data.content,
          images : images
          }
        );
        await chat.save();


        //Trả data chat về client
        //Chỉ trả về thằng dc kết nối với roomChatId
        _io.to(roomChatId).emit("SERVER_RETURN_MESSAGE" ,{
            userId : userId,
            fullName : fullName,
            content : data.content,
            images : images
        } )
    });

    // người dùng đánh máy 
    socket.on("CLIENT_SEND_TYPING",async (type) => {
           //Chỉ trả về thằng dc kết nối với roomChatId
      socket.broadcast.to(roomChatId).emit('SERVER_RETURN_TYPING', {
        userId : userId,
        fullName : fullName,
        type :type
    });

    });

  });

}