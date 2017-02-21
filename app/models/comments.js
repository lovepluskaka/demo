/**
 * Created by Administrator on 2017/2/13.
 */
var Comment = require('../lib/mongo').Comment;

module.exports = {
//   创建一个留言
    create: function create(comment) {
        return Comment.create(comment);
    },
//    通过文章ID和留言ID删除一个留言
    delOneComment: function delOneComment(commentId, author) {
        return Comment.remove({_id: commentId, author: author})
    },
//    通过文章ID删除所有留言
    delAllComment: function delAllComment(postId) {
        return Comment.remove({postId: postId})
    },
//通过文章 id 获取该文章下所有留言，按留言创建时间升序
    getComments: function getComments(postId) {
       return Comment.find({postId:postId})
           .populate({path:'author'})
           .sort({id:-1})
    },
//    通过文章id获取文章下的留言总数
    countComments:function countComments(postId) {
        return Comment.count({postId:postId})  
    }
};