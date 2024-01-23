const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const categoryMiddleware = require("../../middlewares/client/category.middleware");
const blogRoutes=require("./blog.route");
const searchRoutes = require("./search.route");
module.exports = (app) => {
  app.use(categoryMiddleware.category);

  // sử dụng các router đã tạo ở bên home
  app.use("/", homeRoutes);

  // sử dụng các router đã tạo ở bên products
  app.use("/products",productRoutes);

  app.use("/blogs",blogRoutes);

  app.use("/search",searchRoutes);
};
