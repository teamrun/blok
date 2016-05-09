var socket = io();

function shouldReload(){
    var pagePath = window.location.pathname;
    var domain = window.location.protocol + '//' + window.location.host
    var linkTags = document.querySelectorAll('link[rel="stylesheet"]');

    var cssLinkMap = {};
    [].slice.call(linkTags).forEach((tag) => {
        cssLinkMap[tag.href] = tag;
    });

    var pageResources = {
        html: pagePath,
        css: cssLinkMap
    };
    return function(changeInfo){
        if(changeInfo.html && changeInfo.html.length > 0){
            changeInfo.html.forEach(function(changedHtml){
                if(changedHtml === pageResources.html){
                    console.log('html changed, reload page');
                    window.location.reload();
                }
            });
        }
        else{
            if(changeInfo.css && changeInfo.css.length > 0){
                changeInfo.css.forEach(function(changedCss){
                    var fullUrl = domain + changedCss;
                    if(pageResources.css[fullUrl]){
                        console.log('style changed, reloading ' + changedCss);
                        pageResources.css[fullUrl].href = changedCss + '?ts=' + Date.now();
                    }
                });
            }
        }
    }
}

var changeResHandler = shouldReload();
socket.on('filechange', changeResHandler);
