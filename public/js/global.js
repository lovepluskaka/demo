/**
 * Created by Administrator on 2017/2/16.
 */
requirejs.config({
   baseUrl:'/js/',
    paths:{
        blog:'./module',
        semantic:'//cdn.bootcss.com/semantic-ui/2.1.8/semantic.min'
    },
    shim:{
        'semantic':{
            deps:['jquery']
        },
        'paginations':{
            deps:['jquery']
        }
    }
});