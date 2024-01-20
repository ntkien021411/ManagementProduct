
const dashboardRoutes = require('./dashboard.route');
const productRoutes = require('./product.route');
const productCategoryRoutes = require('./product-category.route');
const systemConfig = require('../../config/system');
const roleRoutes = require('./role.route');
const accountRoutes = require('./account.route');
const postCategoryRoutes = require('./post-category.route');
const postRoutes = require('./post.route');
//Login 
const authRoutes = require('./auth.route');

//Middleware for route private (phải đăng nhập mới được truy cập vào route)
const authMiddleware = require("../../middlewares/admin/auth.middleware");

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;

  app.use(PATH_ADMIN+"/dashboard",authMiddleware.requireAuth,dashboardRoutes);
  
  app.use(PATH_ADMIN+"/products",authMiddleware.requireAuth, productRoutes);

  app.use(PATH_ADMIN+"/products-category",authMiddleware.requireAuth, productCategoryRoutes);

  app.use(PATH_ADMIN+"/roles",authMiddleware.requireAuth, roleRoutes);

  app.use(PATH_ADMIN+"/accounts",authMiddleware.requireAuth, accountRoutes);

  // app.use(PATH_ADMIN+"/posts",);

  app.use(PATH_ADMIN+"/posts-category",authMiddleware.requireAuth,postCategoryRoutes);
  app.use(PATH_ADMIN+"/posts",authMiddleware.requireAuth,postRoutes);
  //Login 
  app.use(PATH_ADMIN+"/auth", authRoutes);

};
