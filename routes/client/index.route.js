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
module.exports = (app) => {
  app.use(categoryMiddleware.category);
  app.use(cartMiddleware.cartId);
  app.use(userMiddleware.infoUser);
  // sử dụng các router đã tạo ở bên home
  app.use("/", homeRoutes);

  // sử dụng các router đã tạo ở bên products
  app.use("/products",productRoutes);

  app.use("/blogs",blogRoutes);

  app.use("/search",searchRoutes);

  app.use("/cart",cartRoutes);

  app.use("/checkout",checkoutRoutes);

  app.use("/user",userRoutes);
};
