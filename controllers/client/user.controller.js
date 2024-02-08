const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const generateToken = require("../../helpers/generateToken");
var md5 = require("md5");
const sendMailHelper = require("../../helpers/sendMail");
const Cart = require("../../models/cart.model");
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

  await User.updateOne({
    _id : user.id
  },{
    statusOnline : "online"
  })

  await Cart.updateOne(
    {
      _id: req.cookies.cartId,
    },
    {
      user_id: user.id,
    }
  );

  res.redirect(`/`);
};

// [GET] /user/logout
module.exports.logout = async (req, res) => {
  await User.updateOne({
    _id : res.locals.user.id
  },{
    statusOnline : "offline"
  })
  res.clearCookie("tokenUser");
  res.redirect(`/`);
};

// [GET] /user/password/forgot
module.exports.forgotPassword = (req, res) => {
  res.render("client/pages/user/forgot-password", {
    title: "Lấy lại mật khẩu",
  });
};

// [POST] /user/password/forgot
module.exports.forgotPasswordPatch = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", `Email không tồn tại!`);
    res.redirect(`back`);
    return;
  }
  //Việc : tạo mã OTP và lưu OTP , email vào db
  const code = generateToken.generateRandomSNumber(8);
  const objectForgotPassword = {
    email: email,
    otp: code,
    expireAt: Date.now(),
  };
  const forgot_password = new ForgotPassword(objectForgotPassword);
  await forgot_password.save();

  //Việc 2 : gửi mã otp qua email
  const subject = "Mã OTP xác minh lấy lại mật khẩu";
  const html = `
  Mã OTP xác minh lấy lại mật khẩu là <b>${code}</b>. Thời hạn sử dụng là 3 phút. Lưu ý không được để lộ mã OTP`;
  // console.log(email);
  sendMailHelper.sendMail(email, subject, html);

  res.redirect(`/user/password/otp?email=${email}`);
};

// [GET] /user/password/otp?email=...
module.exports.otp = (req, res) => {
  const email = req.query.email;
  res.render("client/pages/user/otp-password", {
    title: "Nhập mã otp",
    email: email,
  });
};

// [POST] /user/password/otp
module.exports.otpPatch = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });

  if (!result) {
    req.flash("error", `OTP không hợp lệ!`);
    res.redirect(`back`);
    return;
  }
  const user = await User.findOne({
    email: email,
  });
  res.cookie("tokenUserReset", user.tokenUser);

  // console.log(result);
  // res.send("ok");
  res.redirect("/user/password/reset");
};

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password", {
    title: "Đổi mật khẩu",
  });
};

// [POST] /user/password/reset
module.exports.resetPasswordPatch = async (req, res) => {
  const password = req.body.password;

  const tokenUser = req.cookies.tokenUserReset;

  await User.updateOne(
    {
      tokenUser: tokenUser,
    },
    {
      password: md5(password),
    }
  );
  res.clearCookie("tokenUserReset");
  res.redirect("/");
};

// [GET] /user/info
module.exports.info = async (req, res) => {
  res.render("client/pages/user/info", {
    title: "Thông tin tài khoản",
  });
};

// [PATCH] /user/info
module.exports.infoPatch = async (req, res) => {
  const id = req.params.id;

  const updatedBy = {
    user_id: id,
    updatedAt: new Date(),
  };
  if (req.body.password) {
    req.body.password = md5(req.body.password);
  } else {
    delete req.body.password;
  }
  await User.updateOne(
    {
      _id: id,
    },
    {
      ...req.body,
      $push: { updatedBy: updatedBy },
    }
  );
  req.flash("success", `Cập nhật thông tin tài khoản thành công!`);

  // Điều hướng về url về trang danh sách sản phẩm
  res.redirect(`back`);
};
