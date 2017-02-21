/**
 * Created by Administrator on 2017/2/6.
 */
var config = require('config-lite');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect(config.mongodb);
mongoose.Promise = require('bluebird');
// assert.equal(query.exec().constructor, require('bluebird'));

var db = mongoose.connection;
//连接错误
db.on('error', console.error.bind(console, 'connection error:'));
//正常连接
db.once('open', function () {
    console.log(config.mongodb + ' has connected')
});

//定义用户模型
var UserSchema = new Schema({
    name: {type: String, unique: true},//设置用户名全局唯一
    password: String,
    avatar: String,
    gender: {type: String, enum: ['m', 'f', 'x']},//enum验证器，用来对字段值进行限定，单role值是'm','f','x'之一时，才被保存
    bio: String
}, {versionKey: false});

exports.User = mongoose.model('User', UserSchema);

//定义文章模型
var PostSchema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: "User"},
    title: String,
    content: String,
    pv: Number,
    countComment:Number
}, {versionKey: false});
PostSchema.index({author: 1, _id: -1});
exports.Post = mongoose.model('Post', PostSchema);

//简历评论模型
var CommentSchema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: "User",index:1},
    content: String,
    postId: {type: Schema.Types.ObjectId,index:1}
});

exports.Comment = mongoose.model('Comment',CommentSchema);