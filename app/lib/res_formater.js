'use strict';

// TODO: err 信息的隐藏, 不返回

module.exports = () => {
    return function* resFormater(next){
        yield next;
        // 如果是错误
        if(this.body instanceof Error){
            let err = this.body;
            if(err.code){
                this.body = {
                    code: err.code,
                    message: err.message
                };
            }
            else{
                this.status = 500;
                this.body = err.message;
            }
            return;
        }
        // json 数据格式化
        if(this.response.is('json')){
            this.body = {
                code: 200,
                message: 'ok',
                data: this.body
            };
        }
    }
}
