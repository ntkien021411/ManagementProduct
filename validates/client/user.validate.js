module.exports.registerAccount = (req, res, next) => {
    // console.log(req.body);
  if (!req.body.fullName) {
    req.flash("error", `Vui lòng nhập họ tên!`);
    res.redirect(`back`);
    return;
  }
  if (!req.body.email) {
    req.flash("error", `Vui lòng nhập email!`);
    res.redirect(`back`);
    return;
  }
  if (!req.body.password) {
    req.flash("error", `Vui lòng nhập mật khẩu!`);
    res.redirect(`back`);
    return;
  }
  // else{
  //  if(req.body.password.length < 5){
  //   req.flash("error", `Mật khẩu tối thiếu 5 kí tự!`);
  //   res.redirect(`back`);
  //   return;
  //  }
  // }
  //middlerware next()
  next(); //next sang bước kế tiếp
};

module.exports.loginAccount = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", `Vui lòng nhập email!`);
    res.redirect(`back`);
    return;
  }
  if (!req.body.password) {
    req.flash("error", `Vui lòng nhập mật khẩu!`);
    res.redirect(`back`);
    return;
  }
  // else{
  //  if(req.body.password.length < 5){
  //   req.flash("error", `Mật khẩu tối thiếu 5 kí tự!`);
  //   res.redirect(`back`);
  //   return;
  //  }
  // }
  //middlerware next()
  next(); //next sang bước kế tiếp
};

module.exports.forgotPassword = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", `Vui lòng nhập email!`);
    res.redirect(`back`);
    return;
  }
 
  //middlerware next()
  next(); //next sang bước kế tiếp
};

module.exports.resetPass = async (req, res, next) => {
  if(!req.body.password){
    req.flash("error","Mật khẩu không được để trống!");
    res.redirect("back");
    return;
  }   
  
  if(!req.body.confirmPassword){
    req.flash("error","Vui lòng xác nhận lại mật khẩu!");
    res.redirect("back");
    return;
  } 

  if(req.body.confirmPassword != req.body.password){
    req.flash("error","Xác nhận mật khẩu không trùng khớp!");
    res.redirect("back");
    return;
  } 
     next();
 };
 