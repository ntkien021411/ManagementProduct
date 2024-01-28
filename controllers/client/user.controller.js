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

  const expiresTime = 1000 * 60 *60;
  res.cookie("tokenUser", user.tokenUser,{expires: new Date(Date.now()+expiresTime)});
  res.redirect(`/`);
};
