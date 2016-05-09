'use strict';

const Router = require('koa-router');

const ctrls = require('../controller');
const log = require('./logger');
// router prefixes
// or nested routers?
const ApiRouter = new Router({
    prefix: '/api'
});

let bindRoute = (r) => {
    log.debug(`    ${r.method}: ${r.path}`);
    ApiRouter[r.method](r.path, r.handler);
}
module.exports = function apiMounter(app){
    let allRoute = ctrls;
    log.debug('mounting...');
    allRoute.forEach((r, i, arr) => {
        bindRoute(r);
    });
    app.use(ApiRouter.routes());
};
