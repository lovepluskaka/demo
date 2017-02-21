/**
 * Created by Administrator on 2017/2/4.
 */
var express = require('express');
var router = express.Router();
var checkNotLogin = require('../../middlewares/check').checkNotLogin;
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
var UserModal = require('../models/user');

//登录页面
router.get('/', checkNotLogin, function (req, res, next) {
    req.fields.name = null;
    req.fields.password = null;
    res.render('signin');
});
//登录
router.post('/', checkNotLogin, function (req, res, next) {
    var name = req.fields.name;
    var password = req.fields.password;
    UserModal.getUserByName(name)
        .then(function (result) {
            var user = result;
            var checkword = result.password;
            if (bcrypt.compareSync(password,checkword)){
                //登录成功将用户信息写入session
                req.session.user = user;
                req.flash('success','登录成功!');
                res.redirect('/posts');
            }
            else {
                req.flash('error','用户名称与密码不匹配');
                res.redirect('back');
            }
        })
        .catch(function (err) {
            req.flash('error','用户名称不存在');
            res.redirect('back');
            next();
        })
});

module.exports = router;