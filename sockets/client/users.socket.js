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
      // console.log("check2");
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
      //Lấy độ dài acceptFriends của B trả về cho B
      const infoUserB = await User.findOne({
        _id: userId,
      });
      // console.log("check1");
      const lengthAcceptFriend = infoUserB.acceptFriends.length;
      //Khi thằng A gửi kết bạn thì sẽ gửi socket về cho tất trừ thằng A
      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId: userId,
        lengthAcceptFriend: lengthAcceptFriend,
      });

      //Trả về thông tin của A để hiện ra trong danh sách lời mời kết bạn của B
      const infoUserA = await User.findOne({
        _id: myUserId,
      }).select("id avatar  fullName ");
      socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
        userId: userId,
        infoUserA: infoUserA,
      });
      


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

      //Lấy độ dài acceptFriends của B trả về cho B
      const infoUserB = await User.findOne({
        _id: userId,
      });
      // console.log("check1");
      const lengthAcceptFriend = infoUserB.acceptFriends.length;
      //Khi thằng A gửi kết bạn thì sẽ gửi socket về cho tất trừ thằng A
      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId: userId,
        lengthAcceptFriend: lengthAcceptFriend,
      });

      //Lấy userId của A trả về cho ông B
      socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND", {
        userId: userId,
        userIdA : myUserId
      });
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
      //B từ chối cx cập nhật lại lời mời kết bạn
      const infoUserB = await User.findOne({
        _id: myUserId,
      });
      const lengthAcceptFriend = infoUserB.acceptFriends.length;
      socket.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId: myUserId,
        lengthAcceptFriend: lengthAcceptFriend,
      });
      
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
                room_chat_id: "",
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
                room_chat_id: "",
              },
            },
            $pull: { requestFriends: myUserId },
          }
        );
      }
      //B Accept cx cập nhật lại lời mời kết bạn
      const infoUserB = await User.findOne({
        _id: myUserId,
      });
      const lengthAcceptFriend = infoUserB.acceptFriends.length;
      socket.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId: myUserId,
        lengthAcceptFriend: lengthAcceptFriend,
      });
    });
  });
};
