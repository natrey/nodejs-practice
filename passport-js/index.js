const Koa = require('koa');
const Router = require('koa-router');

const logger = require('koa-logger');
const bodyParse = require('koa-bodyparser');

const errorHandler = require('./middleware/errorHandler');
const authRoute = require('./routes/auth');

const app = new Koa();
const router = new Router();

app.use(logger());
app.use(bodyParse());
app.use(errorHandler);

router.get('/auth', authRoute);

app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(3000, console.log('Server listening on port: 3000'));
