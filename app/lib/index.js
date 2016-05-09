'use strict';

const http = require('http');
const path = require('path');

const serve = require('koa-static');

const apiMounter = require('./api_mounter');
const viewMounter = require('./view_mounter');
const resFormater = require('./res_formater');
const wlrServer = require('./wlr');

const appRootPath = path.resolve(__dirname, '../');

module.exports = (app) => {
    const assetsPath = appRootPath + '/public';
    const viewsPath = appRootPath + '/views';
    const pageCtrlPath = appRootPath + '/controller/page';
    const server = http.createServer(app.callback())

    // 统一返回数组, 因为预处理器/模板语言 都有 include/import/extends 类的功能
    wlrServer(server, {
        [assetsPath]: (fileName) => {
            return {css: [`/${fileName}`]}
        },
        [viewsPath]: (fileName) => {
            let html = fileName === 'index.jade'? '/' : ('/' + path.basename(fileName, '.jade'));
            return {html: [html]};
        }
    });
    // 静态资源
    app.use(serve(assetsPath));
    // 统一返回格式化
    app.use(resFormater());
    // app 错误 try-catch
    app.use(function* catchAppErr(next){
        try{
            yield next;
        }
        catch(err){
            this.body = new Error(`caught by catchAppErr, ${err.message}`);
        }
    });
    // api 路由
    apiMounter(app);
    // 页面路由
    app.use(viewMounter(viewsPath, pageCtrlPath, {
        default: 'jade',
        map: {html: 'jade'}
    }));

    return server;
}
