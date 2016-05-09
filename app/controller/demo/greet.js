module.exports = [
    {
        method: 'get',
        path: '/demo/greet',
        handler: function*(){
            this.body = 'Best regard from api mounter~'
        }
    }
];
