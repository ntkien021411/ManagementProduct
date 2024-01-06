//Connect với mongoDB
const mongoose = require('mongoose');
// ENV
require('dotenv').config();
module.exports.connect = async ()=>{
    try {
      await  mongoose.connect(process.env.MONGO_URL);
      console.log("Database Connect Success!");
    } catch (error) {
        console.log("Database Connect Error");
    }
}