const Chat = require("../../models/chat.model");
const upload =require("../../helpers/uploadToCloudinary");
module.exports =async (res) =>{
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;
     //Socket.IO
  _io.once("connection", (socket) => {
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
          content: data.content,
          images : images
          }
        );
        await chat.save();


        //Trả data chat về client
        _io.emit("SERVER_RETURN_MESSAGE" ,{
            userId : userId,
            fullName : fullName,
            content : data.content,
            images : images
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

}