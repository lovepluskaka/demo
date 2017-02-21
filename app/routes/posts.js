/**
 * Created by Administrator on 2017/2/4.
 */
var express = require('express');
var router = express.Router();
var commentModal = require('../models/comments');
var PostModal = require('../models/posts');

var checkLogin = require('../../middlewares/check').checkLogin;

// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
router.get('/', checkLogin, function (req, res, next) {
    var author = req.query.author;
    PostModal.getPost(author)
        .then(function (results) {
            res.render('posts', {posts: results, comments: 0, ctrComments: false});
        })
        .catch(next);
});
//发表一篇文章
router.post('/', checkLogin, function (req, res, next) {
    res.send(req.flash());
});
//发表文章页
router.get('/create', checkLogin, function (req, res, next) {
    res.render('create');
});
//发表文章输入
router.post('/create', checkLogin, function (req, res, next) {
    var title = req.fields.title;
    var content = req.fields.content;
    var author = req.session.user._id;
    if (!title.length) {
        throw new Error('请输入标题');
    }
    if (!(title.length < 50)) {
        throw new Error('标题的长度不能超过50');
    }
    if (!content.length) {
        throw new Error('请输入文章内容');
    }
    if (!(content.length < 1000)) {
        throw new Error('文章长度不能大于1000');
    }
    ;
    var article = {
        author: author,
        title: title,
        content: content,
        pv: 0,
        countComment: 0
    };
    PostModal.create(article)
        .then(function (result) {
            var post = result;
            req.flash('success', '发表成功');
            //重定向到文章页
            res.redirect(`/posts?author=${post.author}`);
        })
        .catch(function (err) {
            req.flash('error', '发表失败');
            next();
        });
});
//具体的一篇文章
router.get('/:postId', function (req, res, next) {
    var postsId = {_id: req.params.postId};
    var result = null,
        posts = null,
        comments = null,
    user = null;
    Promise.all([
        PostModal.incPv(postsId),
        PostModal.getPostById(postsId),
        commentModal.getComments(postsId)
    ]).then(function (result) {
        var post = result[1];
        if (!post) {
            throw new Error('文章不存在');
        }
        var comments = result[2];
        user = req.session.user;
        res.render('posts', {posts: [post], comments: {comments: comments}, ctrComments: true, user: user});
    }).catch(next);

});
//修改文章页
router.get('/:postId/edit', checkLogin, function (req, res, next) {
    var authorId = req.session.user._id;
    var postId = {_id: req.params.postId};
    PostModal.getPostById(postId)
        .then(function (result) {
            if (!result) {
                throw new Error('该文章不存在');
            }
            if (authorId.toString() !== result.author._id.toString()) {
                throw new Error('权限不足');
            }
            res.render('edit', result);
        })
        .catch(next);
});
//修改文章
router.post('/:postId/edit', checkLogin, function (req, res, next) {
    var title = req.fields.title;
    var content = req.fields.content;
    var data = {
        title: title,
        content: content
    };
    var author = req.session.user._id;
    var postId = req.params.postId;
    PostModal.updatePostById(postId, author, data)
        .then(function (result) {
            req.flash('success', '更新成功');
            res.redirect(`/posts?author=${author}`);
        })
        .catch(function (err) {
            req.flash('error', '更新失败');
            res.redirect(`/posts?author=${author}`);
        })
});
//删除文章
router.get('/:postId/remove', checkLogin, function (req, res, next) {
    var author = req.session.user._id;
    var postId = req.params.postId;
    PostModal.deletePost(postId, author)
        .then(function (result) {
            commentModal.delAllComment(postId)
                .then(function (success) {
                    req.flash('success', '删除成功');
                    res.redirect('/posts');
                })
        })
        .catch(next);
});
//创建留言
router.post('/:postId/comment', checkLogin, function (req, res, next) {
    var content = req.fields.content,
        postId = req.params.postId,
        author = req.session.user._id,
        comment = null;
    if (content.length == 0) {
        req.flash('error', '请输入评论内容');
        res.redirect('back');
    } else if (content.length > 120) {
        req.flash('error', '评论长度不能超过120个字');
        res.redirect('back');
    } else {
        comment = {
            author: author,
            content: content,
            postId: postId
        };
        commentModal.create(comment)
            .then(function (result) {
                //给评论总数加1
                PostModal.incComment(postId,1)
                    .then(function (result) {
                        req.flash('success', '评论成功');
                        // req.fields.content = null;
                        res.redirect('back');
                    })
            })
            .catch(function (err) {
                req.flash('error','评论失败');
            })
    }
});
//删除留言
router.get('/:postId/comment/:commentId/remove', checkLogin, function (req, res, next) {
    var commentId = req.params.commentId;
    var author = req.session.user._id;
    var postId = req.params.postId;
    commentModal.delOneComment(commentId,author)
        .then(function (result) {
            PostModal.incComment(postId,-1)
                .then(function (result) {
                    req.flash('success','删除成功');
                    res.redirect('back');
                })
        })
        .catch(next);
});

module.exports = router;
