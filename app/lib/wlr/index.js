'use strict';

const fs = require('fs');
const path = require('path');
const socketIO = require('socket.io');

const log = require('../logger');

/*
 * @param: server: app.callback()
 * @param: watchPath - serverPathResolveFn  kv pair
 */

let watchOpt = {
    recursive: true
};
module.exports = (server, pathResolver) => {
    let io = socketIO(server);
    let sockSet = {};
    let watchPaths = Object.keys(pathResolver);
    watchPaths.forEach((p) => {
        fs.watch(p, watchOpt, (type, filename) => {
            let  changeInfo = pathResolver[p](filename);
            log.debug('change info', changeInfo);
            // 广播文件变更
            io.emit('filechange', changeInfo);
        });
    });
    io.on('connection', (sock) => {
        // log.debug(`new connection: ${sock.id}`);
        sockSet[sock.id] = sock;

        sock.on('disconnect', () => {
            if(sockSet[sock.id]){
                delete sockSet[sock.id];
                // log.debug('dis connect', sock.id);
            }
        });
    });
}
