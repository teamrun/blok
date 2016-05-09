'use strict';

const fs = require('fs');
const path = require('path');

const views = require('co-views');
const promisify = require('es6-promisify');

let REG_API_PATH = /^\/api\//;
let accessFile = promisify(fs.access);
let viewPathTester = (path) => {
    return !REG_API_PATH.test(path);
}

// 中间件系统, 计算出一个查看文件是否存在的函数
let  genViewFileChecker = (viewPath, opt) => {
    // 整合中间件参数, 返回一个只需要 viewName 的检测函数
    return (viewName) => {
        let filePath = path.join(viewPath, viewName);
        let extName = path.extname(filePath);
        // 没有后缀名
        if(extName === ''){
            filePath += '.' + opt.default;
        }
        // 有后缀名
        else{
            /* ---------
             * !! 注意 co-views 的 opt 中的 map, 不是说某个后缀名map 到另一个后缀名的文件
             *          而是 文件还是指定的文件, 渲染引擎用 map 到的那个名字的引擎
            let mapExt = (opt.map)? opt.map[extName.substr(1)] : false;
            if( mapExt ){
                filePath = filePath.replace(extName, '.' + mapExt);
            }
            else{
                return Promise.resolve(false);
            }
            -------------------------------          */
        }
        return accessFile(filePath).then(() => true, () => false);
    }
}
/* 所需要的参数有:
 *      视图存放目录   {最好是绝对路径}
 *      controller目录    {最好是绝对路径}
 *      视图引擎选项 同co-views的option
 */
module.exports = (viewPath, ctrlPath, opt) => {
    let render = views(viewPath, opt);
    let handlers = {};
    try{
        handlers = require(ctrlPath);
    }
    catch(err){
        console.log(`can not log page controller ${ctrlPath}, ${err.stack}`);
    }
    let isViewExits = genViewFileChecker(viewPath, opt);

    return function*(next){
        let reqPath = this.path;
        let viewName = reqPath.replace(/^\//, '');
        if(viewName === '') viewName = 'index';
        console.log(reqPath, viewName);
        if(viewPathTester(reqPath)){
            let handlerFn = handlers[reqPath];
            // 如果有专门的 handlerFn, 不再做 视图文件是否存在的校验
            // 由 handlerFn 负责后面所有的后果
            if(handlerFn){
                // 尽量使handler通用化, 直接拿出去作为app的路由处理也能被使用
                // 将ctx按this的方式传递
                yield handlerFn.apply(this, [(locale) => {
                    return render(viewName, locale);
                }, next]);
            }
            else{
                // 没有指定的 handler, 检查文件是否存在, 不存在就跳到之后的路由
                let viewFileExists = yield isViewExits(viewName);
                if(!viewFileExists){
                    return yield next;
                }

                this.body = yield render(viewName);
            }
        }
        else{
            yield next;
        }
    }
}
