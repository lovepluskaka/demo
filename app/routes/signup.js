/**
 * Created by Administrator on 2017/2/4.
 */
var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
var secret = require('config-lite').secret;
var UserModal = require('../models/user');
var checkNotLogin = require('../../middlewares/check').checkNotLogin;

//注册页面
router.get('/', checkNotLogin, function (req, res, next) {
    res.render('signup');
});
//注册
router.post('/', checkNotLogin, function (req, res, next) {
    var name = _.str.trim(req.fields.name);
    var password = _.str.trim(req.fields.password);
    var repassword = _.str.trim(req.fields.password);
    var gender = req.fields.gender;
    var avatar = req.files.avatar.path.split(path.sep).pop();
    var bio = _.str.trim(req.fields.bio);

    try {
        if (!(name.length >= 1 && name.length <= 10)) {
            throw new Error('名字请限制在1-10个字符');
        }
        if (!(password.length >= 6 && password.length <= 10)) {
            throw new Error('密码的长度6-10位')
        }
        if (!(password === repassword)) {
            throw new Error('两次输入密码不一致');
        }
        if (!(_.indexOf(['m', 'f', 'x'], gender) >= 0)) {
            throw new Error('请输入正确的性别');
        }
        if (!(bio.length >= 3 && bio.length <= 20)) {
            throw new Error('个人简介的长度为3-20位');
        }
        if (!req.files.avatar.name) {
            throw new Error('请上传图片')
        }
        // if (!(req.files.avatar.size < 200000)) {
        //     throw new Error('图片大小超过限制')
        // }
    } catch (e) {
        fs.unlink(req.files.avatar.path);
        req.flash('error', e.message);
        return res.redirect('/signup');
    }
    //bcrypt对密码进行加密
    password = bcrypt.hashSync(password, salt);
    //待写入库的用户信息
    var user = {
        name: name,
        password: password,
        avatar: avatar,
        gender: gender,
        bio: bio
    };
    UserModal.create(user)
        .then(function (result) {
            // user为入库后的结果,包含_id
            var user1 = result;
            //session入库
            user1.password = '';
            // delete user1.password;
            req.session.user = user1;

            //消息通知
            req.flash('success', '注册!');
            //    注册成功跳转到首页
            res.redirect('/posts');
        })
        .catch(function (err) {
            //删除用户上传的头像
            fs.unlink(req.files.avatar.path);
            //用户名被占用就重定向到注册页
            if (err.message.match('E11000 duplicate key')) {
                req.flash('error', '用户名已被占用');
                return res.redirect('/signup');
            }
            next(err);
        })
});


module.exports = router;