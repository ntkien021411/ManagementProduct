const User = require("../../models/user.model");
const usersSocket = require("../../sockets/client/users.socket");
// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  usersSocket(res);


  const userId = res.locals.user.id;
  const myUser = await User.findOne({
    _id : userId
  });
  const requestFriends = myUser.requestFriends;
  const acceptFriends = myUser.acceptFriends;
  //Lấy tất cả trừ những thằng mk gửi yêu cầu kết bạn
  // và những thằng gửi yêu cầu kết bạn cho mk
  const users = await User.find({
    $and : [
      {_id :{$ne:userId}},
      {_id :{$nin:requestFriends}},
      {_id :{$nin:acceptFriends}}
    ],
    status: "active",
    deleted: false,
  }).select("avatar  fullName ");
  res.render("client/pages/users/not-friend", {
    title: "Danh sách người dùng",
    users: users,
  });
};
