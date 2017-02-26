/**
 * Created by Administrator on 2017/2/9.
 */
var Post = require('../lib/mongo').Post;

module.exports = {
//   创建文章
    create: function create(article) {
        return Post.create(article);
    },
    //通过文章Id获取一篇文章
    getPostById: function getPostById(postId) {
        return Post.findOne(postId)
            .populate({path: 'author'})
    },
//    按照时间降序获取所有文章或所有用户的文章
    getPost: function getPost(author,index,limiter) {
        var query = {};
        if (author) {
            query.author = author;
        }
        return Post.find(query)
            .skip((index-1)*limiter)
            .limit(limiter)
            .populate({path: 'author',select:{password:0}})
            .sort({_id: -1});
    },
//    通过id给文章pv加1
    incPv: function (postId) {
        return Post
            .update({_id: postId}, {$inc: {pv: 1}})
    },
//通过id给文章的评论数加1或者减1
    incComment:function (postId,num) {
       return Post
           .update({_id:postId},{$inc:{countComment:num}})
    },
//通过用户Id和文章Id更新一篇新文章
    updatePostById: function updatePostById(postId, author, data) {
        return Post
            .update({author: author, _id: postId}, {$set: data})
    },
//    通过用户名和文章Id删除一篇文章
    deletePost:function deletePost(postId,author) {
        return Post.remove({author: author, _id: postId})
    },
//   计算文章总数
    countPosts:function countPosts(author) {
        if (author){
            return Post.count({author:author})
        }else{
            return Post.count()
        }

    }
};