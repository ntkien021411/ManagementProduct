const PostCategory = require("../../models/post-category.model");
const Post = require("../../models/post.model");
// [GET] /blogs
module.exports.index = async (req, res) => {
  const posts = await Post.find({
    status: "active",
    deleted: false,
  }).sort({ position: "asc" });
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
// [GET] /blogs/:slug
module.exports.detail = async (req, res) => {

  try {
    let find = {
      deleted: false,
      slug: req.params.slug,
      status:"active"
    };

    const blog = await Post.findOne(find);
    const postCategory = await PostCategory.findOne({
        _id: blog.post_category_id,
      });
     
    res.render("client/pages/blogs/detail", {
      title: blog.title,
      blog: blog,
      postCategory:postCategory
    });
  } catch (error) {
    res.redirect(`/blogs`);
  }
};
