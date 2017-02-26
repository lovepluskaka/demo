/**
 * Created by linhong on 2017/2/21.
 */
module.exports = {
    port:6700,
    secret:'lh19940611',
    session:{
        secret:'myblog',
        key:'myblog',
        maxAge:86400000
    },
    mongodb:'mongodb://localhost:27017/lhblog'
};