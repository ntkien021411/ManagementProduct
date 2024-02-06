const User = require("../../models/user.model");

module.exports = async (res) => {
  const myUserId = res.locals.user.id;
  //Socket.IO
  _io.once("connection", (socket) => {
    //Nhận id của B : người được gửi yêu câu kết bạn
    //Người dùng gửi yêu cầu kết bạn
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

    //Người dùng hủy gửi yêu cầu kết bạn
    //Nhận id của B : người được HỦY yêu câu kết bạn
    socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
      //   console.log(myUserId); //A
      //   console.log(userId); //B

      //Xóa ID của A vào acceptFriend của B
      //Kiểm tra xem B đã nhận dc yêu cầu kết bạn của A hay chưa
      const existUserAInB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId,
      });
      if (existUserAInB) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $pull: { acceptFriends: myUserId },
          }
        );
      }

      //Xóa ID của B vào requestFriend của A
      //Kiểm tra xem A đã gửi yêu cầu kết bạn cho B hay chưa
      const existUserBInA = await User.findOne({
        _id: myUserId,
        requestFriends: userId,
      });
      if (existUserBInA) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $pull: { requestFriends: userId },
          }
        );
      }
    });

    //Người dùng từ chối kết bạn
    //Nhận id của A : người  gửi yêu cầu kết bạn
    socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
      //   console.log(myUserId); //B
      //   console.log(userId); //A

      //Xóa ID của A vào acceptFriend của B
      const existUserAInB = await User.findOne({
        _id: myUserId,
        acceptFriends: userId,
      });
      if (existUserAInB) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $pull: { acceptFriends: userId },
          }
        );
      }

      //Xóa ID của B vào requestFriend của A
      const existUserBInA = await User.findOne({
        _id: userId,
        requestFriends: myUserId,
      });
      if (existUserBInA) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $pull: { requestFriends: myUserId },
          }
        );
      }
    });

    //Người dùng chấp nhận kết bạn
    //Nhận id của A : người  gửi yêu cầu kết bạn
    socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
      //   console.log(myUserId); //B
      //   console.log(userId); //A

      //Xóa ID của A trong acceptFriend của B
      //Thêm{user_id,room_chat_id} của A vào friendList của B
      const existUserAInB = await User.findOne({
        _id: myUserId,
        acceptFriends: userId,
      });
      if (existUserAInB) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $push: {
              friendList: {
                user_id: userId,
                room_chat_id : ""
              },
            },
            $pull: { acceptFriends: userId },
          }
        );
      }

      //Xóa ID của B trong requestFriend của A
      //Thêm{user_id,room_chat_id} của B vào friendList của A
      const existUserBInA = await User.findOne({
        _id: userId,
        requestFriends: myUserId,
      });
      if (existUserBInA) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $push: {
                friendList: {
                  user_id: myUserId,
                  room_chat_id : ""
                },
              },
            $pull: { requestFriends: myUserId },
          }
        );
      }
    });
  });
};
