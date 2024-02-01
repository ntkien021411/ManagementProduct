const express = require("express");
const router = express.Router();

//Nhúng multer để upload ảnh ở trên máy tính cá nhân
const multer = require("multer");
const upload = multer();