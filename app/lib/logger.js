'use strict';

const log = console.log.bind(console);

module.exports = {
    info: log,
    debug: log,
    warn: console.warn.bind(console),
    err: console.error.bind(console),
    error: console.error.bind(console)
};
