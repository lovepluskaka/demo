/**
 * Created by Administrator on 2017/2/4.
 */
module.exports = function (app) {
    app.get('/', function (req, res, next) {
        res.redirect('/posts');
    });
    app.use('/posts', require('./posts'));
    app.use('/signin', require('./signin'));
    app.use('/signup', require('./signup'));
    app.use('/signout', require('./signout'));
    app.use(function (req, res) {
        if (!res.headersSent) {
            res.render('404');
        }
    });
    // 错误页面
    app.use(function (err, req, res, next) {
        res.render('error', {error: err});
    });
};