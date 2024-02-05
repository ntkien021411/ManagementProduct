const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_KEY_CLOUD,
});

//upload lên cloud
let streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

//Upload ảnh lên cloud và trả về 1 url http
module.exports.uploadToCloudinary = async (buffer) => {
  let result = await streamUpload(buffer);
  return result.url;
};
