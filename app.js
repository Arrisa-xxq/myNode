var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cookieSession = require("cookie-session");
var multer = require("multer");
// var multerObj = multer({dest:"./public/upload"});
var cors = require("cors"); //允许前端跨域请求数据

//服务器搭建
var app = express();

//静态页面托管 可以托管多个静态目录 按顺序由上至下进行资源管理 
app.use(express.static(path.join(__dirname, 'public',"template")));
//用带有 /admin 前缀地址来访问 admin 目录中的文件
app.use("/admin",express.static(path.join(__dirname, 'public',"admin")));
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup 中间件配置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cookieSession({
    name:"cookie_session",
    keys:["aa","bb"],
    maxAge:1000*60*60
}))
app.use(cors({
  "origin": ['http://127.0.0.1:5500'],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders:['Content-Type', 'Authorization']
  }));

//multer中的diskStorage 磁盘存储引擎
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if(req.url.indexOf('user')!==-1 || req.url.indexOf('reg')!==-1){
      cb(null, path.join(__dirname, 'public',require('./config/path').user.uploadUrl))
    }else if(req.url.indexOf('banner')!==-1){
      cb(null, path.join(__dirname, 'public',require('./config/path').banner.uploadUrl))
    }else{
      cb(null, path.join(__dirname, 'public/upload/product'))
    }
  }
})

var upload = multer({ storage:storage });//存储方式dest指定死了，storage分目录
// let objMulter = multer({ dest: path.join(__dirname, 'public/upload')});	//实例化  返回 multer对象
app.use(upload.any());  	//any 允许上传任何文件

//mergan 日志 样式
app.use(logger('dev'));
app.use(express.json());
// body-parser
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


//响应
//admin
//.......
//api 客户端接口响应
//all后面是函数，暴露出来一个函数，所有接口响应指向一个函数
app.all("/api/*",require("./routes/api/params"));
app.use('/api/user', require('./routes/api/user'));
app.use('/api/login', require('./routes/api/login'));
app.use('/api/reg', require('./routes/api/reg'));
app.use('/api/logout', require('./routes/api/logout'));
app.use("/api/:product",require("./routes/api/product"));//动态接口 
app.use('/api/banner', require('./routes/api/banner'));



//处理错误信息
// catch 404 and forward to error handler 
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler 
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  res.send({err:1,msg:"错误的接口"});
});


//对外导出
module.exports = app;
