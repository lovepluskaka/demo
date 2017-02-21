/**
 * Created by Administrator on 2017/2/4.
 */

var path = require('path');
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var config = require('config-lite');
var flash = require('connect-flash');
var routes = require('./app/routes');
var pkg = require('./package');
var formidable = require('express-formidable');
var app = express();
var http = require('http');
var server = http.createServer();
var winston = require('winston'),
    expressWinston = require('express-winston');

//设置全局的事件处理监听总数
require('events').EventEmitter.prototype._maxListeners = 20;

global._ = require('underscore');
_.str = require('underscore.string');
global.Promise = require('bluebird');


//设置模板目录
app.set('views', path.join(__dirname, 'views'));
//设置模板引擎伟ejs
app.set('view engine', 'ejs');

//设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));
//session中间件
app.use(session({
    name: config.session.key,//设置 cookie 中保存 session id 的字段名称
    secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    cookie: {
        maxAge: config.session.maxAge//设置cookie存在时间为24小时,过期后 cookie 中的 session id 自动删除
    },
    store: new MongoStore({// 将 session 存储到 mongodb
        url: config.mongodb
    })
}));
//    使用falsh中间
app.use(flash());

//设置文件上传参数
app.use(formidable({
    uploadDir: path.join(__dirname, 'public/img'),//设置文件存放目录
    keepExtensions: true// 保留后缀
}));

//添加模板常量
app.locals.blog = {
    title: pkg.name,
    description: pkg.description
};

//添加模板变量
app.use(function (req, res, next) {
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    res.locals.user = req.session.user;
    next();
});

//正常的请求日志
app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/success.log'
        })
    ]
}));

//路由
routes(app);

//请求错误的日志
app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/error.log'
        })
    ]
}));

if (module.parent) {
    module.exports = app;
} else {
    //监听端口，启动程序
    app.listen(config.port, function () {
        console.log(`${pkg.name} is running in ${config.port}`);
    });
}
