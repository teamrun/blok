'use strict';

const app = require('koa')();
const conf = require('./conf');
const setup = require('./lib');

var server  = setup(app);

server.listen(conf.port, () => {
    console.log(`server started at ${conf.port}`);
});
