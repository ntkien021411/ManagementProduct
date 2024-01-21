const mongoose = require("mongoose");
var slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

//Tạo model
const postSchema = new mongoose.Schema({
  title: String, //Sản phẩm 1
  post_category_id: {
    type: String,
    default: "",
  },
  description: String,
  content: String,
  thumbnail: String,
  status: String,
  position: Number,
  slug: {
    type: String,
    slug: "title", // san-pham-1 // dựa trên title có trong model
    unique: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    account_id: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  deletedBy: {
    account_id: String,
    deletedAt: Date,
  },
  updatedBy: [
    {
      account_id: String,
      updatedAt: Date,
    },
  ],
});
//Tham số 1 là tên model
//Tham số 2 schema : cấu trúc của dữ liệu để thêm vào db
//Tham số 3 là tên collection(tên table)
const Post = mongoose.model("Post", postSchema, "posts");
module.exports = Post;
