const mongoose = require('mongoose');
var slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

//Tạo model
const productSchema = new mongoose.Schema({
    title:String, //Sản phẩm 1
    description:String,
    price:Number,
    discountPercentage:Number,
    stock:Number,
    thumbnail:String,
    status:String,
    position:Number,
    slug : {
        type : String,
        slug : "title", // san-pham-1 // dựa trên title có trong model
        unique: true
    },
    deleted:{
        type:Boolean,
        default:false
    },
    deletedAt:Date
},{
    // tạo thời gian khi update hoặc create
    timestamps : true
});
//Tham số 1 là tên model
//Tham số 2 schema : cấu trúc của dữ liệu để thêm vào db
//Tham số 3 là tên collection(tên table)
const Product = mongoose.model('Product', productSchema,"products");
module.exports = Product;
