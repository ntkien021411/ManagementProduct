const express = require("express");


//Nhúng express-flash để làm chức năng hiện thị thông báo
var cookieParser = require('cookie-parser')
const session = require('express-session');
var flash = require("express-flash");

//Nhúng body parser để dùng lại body từ form
var bodyParser = require("body-parser");

const app = express();

//Dùng express-flash
app.use(cookieParser("keyboard cat"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());


// Dùng body parser
app.use(bodyParser.urlencoded({ extended: false }));


//Ghi đè lại router
var methodOverride = require("method-override");
// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride("_method"));

//Nhúng file config database connect
const database = require("./config/database");
database.connect();

//Lấy data từ file .env
require("dotenv").config();
const port = process.env.PORT;

// dùng ngôn ngữ pug
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

//Nhúng phải tĩnh css,js,images
app.use(express.static(`${__dirname}/public`));

//TinyMCE
var path = require('path');
app.use('/tinymce', 
express.static(path.join(__dirname, 'node_modules', 'tinymce'))
);



//Nhúng Routes đã tạo
const routeClient = require("./routes/client/index.route");
routeClient(app);
const routeAdmin = require("./routes/admin/index.route");
routeAdmin(app);

//Biến toàn cục 
// App Locals Variables , chỉ dùng dc trong file pug
const systemConfig = require("./config/system");
app.locals.prefixAdmin = systemConfig.prefixAdmin;



app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
