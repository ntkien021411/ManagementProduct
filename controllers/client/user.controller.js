const User = require("../../models/user.model");
var md5 = require("md5");

// [GET] /user/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    title: "Đăng ký tài khoản",
  });
};
// [POST] /user/register
module.exports.registerPatch = async (req, res) => {
  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  });
  req.body.password = md5(req.body.password);
  if (existEmail) {
    req.flash("error", `Email đã tồn tại!`);
    res.redirect(`back`);
    return;
  }
  const user = new User(req.body);
  await user.save();

  const expiresTime = 1000 * 60 * 60;
  res.cookie("tokenUser", user.tokenUser, {
    expires: new Date(Date.now() + expiresTime),
  });
  res.redirect(`/`);
};

// [GET] /user/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login", {
    title: "Đăng nhập tài khoản",
  });
};
// [POST] /user/login
module.exports.loginPatch = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", `Email không tồn tại!`);
    res.redirect(`back`);
    return;
  }
  if (md5(password) != user.password) {
    req.flash("error", `Sai mật khẩu!`);
    res.redirect(`back`);
    return;
  }
  if (user.status == "inactive") {
    req.flash("error", `Tài khoản đang bị khóa!`);
    res.redirect(`back`);
    return;
  }


  const expiresTime = 1000 * 60 * 60 * 24 * 365;
  res.cookie("tokenUser", user.tokenUser, {
    expires: new Date(Date.now() + expiresTime),
  });
  res.redirect(`/`);
};

// [GET] user/logout
module.exports.logout = (req, res) => {
  res.clearCookie("tokenUser");
  res.redirect(`/`);
};
