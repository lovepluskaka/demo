/**
 * Created by Administrator on 2017/2/6.
 */
var User = require('../lib/mongo').User;

module.exports = {
//    注册新用户
    create:function create(user) {
        return User.create(user);
    },
    getUserByName:function (name) {
        return User.findOne({name:name})
    }
};