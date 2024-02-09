const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const categoryMiddleware = require("../../middlewares/client/category.middleware");
const blogRoutes=require("./blog.route");
const searchRoutes = require("./search.route");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const cartRoutes = require("./cart.route");
const checkoutRoutes = require("./checkout.route");
const userRoutes = require("./user.route");

const userMiddleware = require("../../middlewares/client/user.middleware");

const settingGeneralMiddleware = require("../../middlewares/client/setting.middleware");

//Chat Socket IO
const chatRoutes = require("./chat.route");
const authMiddleware =  require("../../middlewares/client/auth.middleware");

const roomChatRoutes = require("./rooms-chat.route");
const usersRoutes = require("./users.route");
module.exports = (app) => {
  app.use(categoryMiddleware.category);
  app.use(cartMiddleware.cartId);
  app.use(userMiddleware.infoUser);
  app.use(settingGeneralMiddleware.settingGeneral);
  // sử dụng các router đã tạo ở bên home
  app.use("/", homeRoutes);

  // sử dụng các router đã tạo ở bên products
  app.use("/products",productRoutes);

  app.use("/blogs",blogRoutes);

  app.use("/search",searchRoutes);

  app.use("/cart",cartRoutes);

  app.use("/checkout",checkoutRoutes);

  app.use("/user",userRoutes);
 
  app.use("/users",authMiddleware.requireAuthUser,usersRoutes);
  //Đăng nhập thì mới vào dc trang chat
  app.use("/chat",authMiddleware.requireAuthUser,chatRoutes);

  app.use("/rooms-chat",authMiddleware.requireAuthUser,roomChatRoutes);
};
