const User = require("../../models/user.model");

module.exports = async (res) => {
  const myUserId = res.locals.user.id;
  const fullName = res.locals.user.fullName;
  //Socket.IO
  _io.once("connection", (socket) => {
    //Nhận id của B : người được gửi yêu câu kết bạn
    socket.on("CLIENT_ADD_FRIEND", async (userId) => {
    //   console.log(myUserId); //A
    //   console.log(userId); //B

      //Thêm ID của A vào acceptFriend của B
      //Kiểm tra xem A đã gửi yêu cầu kết bạn cho B chưa
      const existUserAInB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId,
      });
      if (!existUserAInB) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $push: { acceptFriends: myUserId },
          }
        );
      }

      //Thêm ID của B vào requestFriend của A
      const existUserBInA = await User.findOne({
        _id: myUserId,
        requestFriends: userId,
      });
      if (!existUserBInA) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $push: { requestFriends: userId },
          }
        );
      }
    });
  });
};
