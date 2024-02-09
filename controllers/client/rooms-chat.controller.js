const User = require("../../models/user.model");
const upload = require("../../helpers/uploadToCloudinary");
const RoomChat = require("../../models/room-chat.model");

// [GET] /rooms-chat/
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const roomChat = await RoomChat.find({
    users: { $elemMatch: { user_id: userId } },
  });
  res.render("client/pages/rooms-chat/index", {
    title: "Danh sách phòng",
    roomChat : roomChat,
  });
};

// [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
  const friendList = res.locals.user.friendList;
  for (const item of friendList) {
    const infoUser = await User.findOne({
      _id: item.user_id,
    }).select("id avatar  fullName ");
    item.infoUser = infoUser;
  }

  res.render("client/pages/rooms-chat/create", {
    title: "Tạo phòng",
    friendList: friendList,
  });
};

// [POST] /rooms-chat/create
module.exports.createPost = async (req, res) => {
  const title = req.body.title;
  const usersId = req.body.usersId;

  const dataChat = {
    title: title,
    avatar: "",
    typeRoom: "group",
    users: [],
  };
  dataChat.users.push({
    user_id: res.locals.user.id,
    role: "superAdmin",
  });
  usersId.forEach((item) => {
    dataChat.users.push({
      user_id: item,
      role: "user",
    });
  });
  const roomChat = new RoomChat(dataChat);
  await roomChat.save();
  res.redirect(`/chat/${roomChat.id}`);
};
