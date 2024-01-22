const PostCategory = require("../../models/post-category.model");
const Post = require("../../models/post.model");
const subCategory = require("../../helpers/products-category");
// [GET] /blogs
module.exports.index = async (req, res) => {
  const posts = await Post.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });
  for (const item of posts) {
    //Lấy ra thông tin người tạo
    const postCategory = await PostCategory.findOne({
      _id: item.post_category_id,
    });
    if (postCategory) {
      item.postCategory = postCategory;
    }
  }
  //   console.log(posts);
  res.render("client/pages/blogs/index", {
    title: "Danh sách bài viết",
    posts: posts,
  });
};

// [GET] /blogs/:slugCategory
module.exports.category = async (req, res) => {
  const category = await PostCategory.findOne({
    slug: req.params.slugCategory,
    deleted: false,
  });
  try {
    const listSubCategory = await subCategory.getSubCategoryPost(category.id);
    const listSubCategoryId = listSubCategory.map((item) => item.id);
    const posts = await Post.find({
      deleted: false,
      post_category_id: { $in: [category.id, ...listSubCategoryId] },
    }).sort({ position: "desc" });
    if (posts) {
      for (const item of posts) {
        //Lấy ra thông tin người tạo
        const postCategory = await PostCategory.findOne({
          _id: item.post_category_id,
        });
        if (postCategory) {
          item.postCategory = postCategory;
        }
      }
    }
    res.render("client/pages/blogs/index", {
      title: category.title,
      posts: posts,
    });
  } catch (error) {
    res.send("404");
  }
};

// [GET] /blogs/detail/:slugPost
module.exports.detail = async (req, res) => {
  try {
    let find = {
      deleted: false,
      slug: req.params.slugPost,
      status: "active",
    };

    const blog = await Post.findOne(find);
    if (blog.post_category_id) {
      const postCategory = await PostCategory.findOne({
        _id: blog.post_category_id,
        deleted: false,
        status: "active",
      });
      blog.postCategory = postCategory;
    }
    // console.log(blog);
    res.render("client/pages/blogs/detail", {
      title: blog.title,
      blog: blog,
    });
  } catch (error) {
    res.redirect(`/blogs`);
  }
};
