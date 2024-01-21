const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const createTreeCategoryActive = require("../../helpers/createTreeCategory");
const PostCategory = require("../../models/post-category.model");
module.exports.category = async (req, res, next) => {
    let find = {
        deleted: false,
      };
    
      const records = await ProductCategory.find(find);
      const newRecords = createTreeCategoryActive.createTreeActive(records);
      const posts = await PostCategory.find(find);
      const newPosts = createTreeCategoryActive.createTreeActive(posts);
      res.locals.layoutCategory = newRecords;
      res.locals.layoutPosts = newPosts;
      next();
  };
  
  