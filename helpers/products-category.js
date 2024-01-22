const ProductCategory = require("../models/product-category.model");
module.exports.getSubCategory = async (parentId) => {
  const getCategory = async (parentId) => {
    const subs = await ProductCategory.find({
      parent_id: parentId,
      status: "active",
      deleted: false,
    });
    let allSub = [...subs];
    for (const sub of subs) {
      const childs = await getCategory(sub.id);
      allSub = allSub.concat(childs);
    }
    return allSub;
  };
  const listSubCategory = await getCategory(parentId);
  return listSubCategory;
};
const PostCategory = require("../models/post-category.model");
module.exports.getSubCategoryPost = async (parentId) => {
  const getCategory = async (parentId) => {
    const subs = await PostCategory.find({
      parent_id: parentId,
      status: "active",
      deleted: false,
    });
    let allSub = [...subs];
    for (const sub of subs) {
      const childs = await getCategory(sub.id);
      allSub = allSub.concat(childs);
    }
    return allSub;
  };
  const listSubCategory = await getCategory(parentId);
  return listSubCategory;
};
