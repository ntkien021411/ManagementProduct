const User = require("../../models/user.model");
const usersSocket = require("../../sockets/client/users.socket");
// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  usersSocket(res);

  const userId = res.locals.user.id;
  const myUser = await User.findOne({
    _id: userId,
  });
  const requestFriends = myUser.requestFriends;
  const acceptFriends = myUser.acceptFriends;
  //Lấy tất cả trừ những thằng mk gửi yêu cầu kết bạn
  // và những thằng gửi yêu cầu kết bạn cho mk
  const users = await User.find({
    $and: [
      { _id: { $ne: userId } },
      { _id: { $nin: requestFriends } },
      { _id: { $nin: acceptFriends } },
    ],
    status: "active",
    deleted: false,
  }).select("avatar  fullName ");
  res.render("client/pages/users/not-friend", {
    title: "Danh sách người dùng",
    users: users,
  });
};

// [GET] /users/request
module.exports.request = async (req, res) => {
  usersSocket(res);

  const userId = res.locals.user.id;
  const myUser = await User.findOne({
    _id: userId,
  });
  const requestFriends = myUser.requestFriends;
  //Lấy tất cả trừ những thằng mk gửi yêu cầu kết bạn
  const users = await User.find({
    _id: { $in: requestFriends },
    status: "active",
    deleted: false,
  }).select("id avatar  fullName ");
  // console.log(users);
  res.render("client/pages/users/request", {
    title: "Lời mời đã gửi",
    users: users,
  });
};


// [GET] /users/accept
module.exports.accept = async (req, res) => {
  usersSocket(res);

  const userId = res.locals.user.id;
  const myUser = await User.findOne({
    _id: userId,
  });
  const acceptFriends = myUser.acceptFriends;
  //Lấy tất cả trừ những thằng mk gửi yêu cầu kết bạn
  const users = await User.find({
    _id: { $in: acceptFriends },
    status: "active",
    deleted: false,
  }).select("id avatar  fullName ");
  // console.log(users);
  res.render("client/pages/users/accept", {
    title: "Lời mời đã nhận",
    users: users,
  });
};

// [GET] /users/friends
module.exports.friends = async (req, res) => {
  usersSocket(res);

  const userId = res.locals.user.id;
  const myUser = await User.findOne({
    _id: userId,
  });
  let listFriendId = [];
  for (const item of myUser.friendList) {
    listFriendId.push(item.user_id);
  }
  //Lấy tất cả trừ những thằng mk gửi yêu cầu kết bạn
  const users = await User.find({
    _id: { $in: listFriendId },
    status: "active",
    deleted: false,
  }).select("id avatar  fullName email");
  // console.log(users);
  res.render("client/pages/users/friends", {
    title: "Danh sách bạn bè",
    users: users,
  });
};
