const upload =require("../../helpers/uploadToCloudinary");
//gán lại giá trị cho req.body.thumnail thành link ảnh đã up load
module.exports.uploadImageCloudinary = async (req, res, next) => {
  if (req.file) {
    // console.log(req.file.buffer);
    // console.log(req.file);

    const result = await upload.uploadToCloudinary(req.file.buffer);
    // console.log(result);
    req.body[req.file.fieldname] = result;
  }
  next(); //upload xong mới next
};


