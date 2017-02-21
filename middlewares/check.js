/**
 * Created by Administrator on 2017/2/4.
 */
module.exports = {
  checkLogin:function checkLogin(req,res,next) {
      if (!req.session.user){
          req.flash('error','未登录');
          return res.redirect('/signup');
      }
      next();
  },
    checkNotLogin:function checkNotLogin(req,res,next) {
        if (req.session.user){
            req.flash('success','已登录');
            return res.redirect('back');
        }
        next();
    }
};