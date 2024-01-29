const User = require("../../models/user.model");
//Dành cho trang dashboard,product,category,role,account
module.exports.requireAuthUser = async (req, res, next) => {
  if (!req.cookies.tokenUser) {
    res.redirect(`/user/login`);
    return;
  }
  const user = await User.findOne({
    tokenUser: req.cookies.tokenUser,
  }).select("-password");

  if (!user) {
    res.redirect(`/user/login`);
    return;
  }
  // res.locals.user = user;

  next();
};
