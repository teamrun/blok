'use strict';

const _ = require('lodash');
const argv = require('minimist')(process.argv.slice(2));

let baseConf = {
    port: 3333
};

const env = argv.e || argv.env || 'dev';

let envConf = {};
let evnConfFile = __dirname + `/${env}.js`;
try{
    envConf = require(evnConfFile);
}
catch(e){

}

let conf = _.assign({}, baseConf, envConf);
module.exports = conf;
