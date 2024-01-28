const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");
var md5 = require("md5");

// [GET] /admin/auth/login
module.exports.loginPage = async (req, res) => {
  if (req.cookies.token) {
    const user = await Account.findOne({
      token: req.cookies.token,
    });
    if (user) {
      res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }else{
      // console.log(123);
      res.redirect(`http://localhost:3000/products`);
      return;
    }
  } else {
    res.render("admin/pages/auth/login", {
      title: "Đăng nhập",
    });
  }
};
// [POST] /admin/auth/login
module.exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await Account.findOne({
    email: email,
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
    req.flash("error", `Tài khoản đã bị khóa!`);
    res.redirect(`back`);
    return;
  }

  req.flash("success", `Đăng nhập thành công!`);
  // // 1p   1h   1ngay  1 năm
  const expiresTime = 1000 * 60 *60  * 24 * 365;
  res.cookie("token", user.token,{expires: new Date(Date.now()+expiresTime)});

                          // res.cookie("cartId",cart.id,{expires: new Date(Date.now()+expiresTime)});
                  
  res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
};

// [GET] /admin/auth/logout
module.exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
};
