const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');
const serve = require('koa-static');
const koaBody = require('koa-body');

const app = new Koa();
const router = new Router();

app.use(logger());

// error handling
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = err.message;
        ctx.app.emit('error', err, ctx);
    }
});

let clients = [];

router.get('/subscribe', async (ctx) => {
    const promise = new Promise((resolve, reject) => {
        clients.push(resolve);

        // nodejs.org: Indicates that the underlying connection was terminated before response.end() was called or able to flush.
        ctx.res.on('close', () => {
            clients.splice(clients.indexOf(resolve), 1);

            const error = new Error('Connection closed');
            reject(error);
        });
    });

    let message;

    try {
        message = await promise;
    } catch (err) {
        console.error(err);
    }

    ctx.body = message;
});

router.post('/publish', koaBody(), (ctx) => {
    const body = JSON.parse(ctx.request.body);

    if (!body.message) {
        ctx.throw(400);
    }

    // 1MB limit size
    if (+ctx.request.header['content-length'] > 1e6) {
        ctx.throw(413);
    }

    clients.forEach(res => {
        res('' + body.message);
    });

    clients = [];

    ctx.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    ctx.body = 'ok';

});

app.use(serve('.'));

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
