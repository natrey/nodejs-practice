const passport = require('koa-passport');

module.exports = (ctx) => {
    ctx.body = 'I am the auth route.';
};
