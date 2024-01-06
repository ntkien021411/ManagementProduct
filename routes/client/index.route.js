const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");
module.exports = (app) => {
  // sử dụng các router đã tạo ở bên home
  app.use("/", homeRoutes);

  // sử dụng các router đã tạo ở bên products
  app.use("/products", productRoutes);
};
