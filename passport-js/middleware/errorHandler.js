module.exports = async (ctx, next) => {
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
};
