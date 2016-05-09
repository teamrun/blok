'use strict';

let homePage = function*(render, next){
    this.body = yield render({title: 'Greeting from Chenllos'});
}
module.exports = {
    '/': homePage,
    '/index': homePage
};
