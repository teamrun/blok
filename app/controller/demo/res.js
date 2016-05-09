module.exports = [
    {
        method: 'get',
        path: '/demo/err',
        handler: function*(){
            this.body = new Error('you should see 500 err');
        }
    },
    {
        method: 'get',
        path: '/demo/json',
        handler: function*(){
            this.body = {
                content: 'here is json res formate'
            };
        }
    },
    {
        method: 'get',
        path: '/demo/throw_err',
        handler: function*(){
            throw new Error('i throwed an error');
        }
    }
];
