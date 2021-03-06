const koa = require('koa');
const mongoose = require('mongoose');
const logger = require('koa-logger');
const bodyParse = require('koa-bodyparser');
const router = require('./routes');

const app = new koa();

app.use(logger());
app.use(bodyParse());

mongoose.set('debug', true);
mongoose
    .connect('mongodb://localhost/test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log('Mongo connection created'))
    .catch(err => console.log('Mongo connection error', err));

// error handling
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;

        if (err.status === 400) {
            ctx.body = {
              errors: {
                  field: err.message,
              },
            };
        } else {
            ctx.body = err.message;
        }

        ctx.app.emit('error', err, ctx);
    }
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, console.log('Server listening on port: 3000'));


