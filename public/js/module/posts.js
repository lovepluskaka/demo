/**
 * Created by Administrator on 2017/2/15.
 */
define('blog/posts', ['jquery', 'underscore', 'semantic', 'semantic.popup', 'paginations'], function ($, _) {
    var tpl = _.template([
        '<%_.each(data,function (post) {%>',
        '<div class="post-content">',
        '<div class="ui grid">',
        '<div class="four wide column">',
        '<a class="avatar" href="/posts?author=<%= post.author._id %>" data-title="<%= post.author.name %> | <%= ({m: "男", f: "女", x: "保密"})[post.author.gender] %>" data-content="<%= post.author.bio %>"> <img class="avatar" src="/img/<%= post.author.avatar %>"></a>',
        '</div>',
        '<div class="eight wide column">',
        '<div class="ui segment">',
        '<h3><a href="/posts/<%= post._id %>"><%= post.title %></a></h3>',
        '<pre><%- post.content %></pre>',
        '<div>',
        '<span class="tag"><%= post.created_at %></span>',
        '<span class="tag right">',
        '<span>浏览(<%= post.pv %>)</span>',
        '<span>留言(<%= post.countComment %>)</span>',

        '<% if (user && post.author._id && user._id.toString() === post.author._id.toString()) { %>',
        '<div class="ui inline dropdown">',
        '<div class="text"></div>',
        '<i class="dropdown icon"></i>',
        '<div class="menu">',
        '<div class="item"><a href="/posts/<%= post._id %>/edit">编辑</a></div>',
        '<div class="item"><a href="/posts/<%= post._id %>/remove">删除</a></div>',
        '</div>',
        '</div>',
        '<% } %>',
        '</span>',
        '</div>',
        '</div>',
        '</div>',
        '</div>',
        '</div>',
        '<%})%>'
    ].join(''));
    var ctraAjax;
    function addDrop() {
        // 点击按钮弹出下拉框
        $('.ui.dropdown').dropdown(
            {transition: 'drop'}
        );
        // 鼠标悬浮在头像上，弹出气泡提示框
        $('.post-content .avatar').popup({
            inline: true,
            position: 'bottom right',
            lastResort: 'bottom right',
            on: 'hover'
        });
    };
    function postCallback(result) {
        $('.posts-ul').empty();
        console.log(result.data);
        if (result.data.length) {
            $('.posts-ul').html(tpl({data: result.data, user: result.user}));
            addDrop();
        }
        ctraAjax = false;
    };
    function getPost(ctraAjax,postdata,callback) {
        if (ctraAjax) {
            $.ajax({
                url: "/posts",
                method: "POST",
                dataType: "json",
                data: postdata
            }).done(function (result) {
                callback(result);
                return false;
            })
        }
    };
    $(function () {
        addDrop();
        if (pageNum) {
            $('.pageBottom').pagination({
                items: pageNum,
                cssStyle: 'light-theme',
                hrefTextPrefixL: '#page-',
                onPageClick: function (pageNumber, event) {
                    var index = pageNumber,
                        postdata = {};
                        ctraAjax = true;
                    index = index || 1;
                    postdata = {index: index};
                    getPost(ctraAjax,postdata,postCallback);
                }
            })
        }
    });
});