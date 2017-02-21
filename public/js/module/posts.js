/**
 * Created by Administrator on 2017/2/15.
 */
define('blog/posts', ['jquery', 'semantic', 'semantic.popup', 'paginations'], function ($) {
    $(function () {
        $('.pageBottom').pagination({
            items: 100,
            itemsOnPage: 10,
            cssStyle: 'light-theme',
            hrefTextPrefixL:'#page-'
        })
    });

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
});