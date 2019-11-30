const User = require('../model/User');

module.exports = {
    getUsers: async ctx => {
        const users = await User.find({});

        if (!users) {
            ctx.throw(404, 'There was an error finding users');
        } else {
            ctx.body = {
                status: 'OK',
                data: users,
            };
        }
    },
    getUser: async ctx => {
        const { id } = ctx.query;
        const user = await User.findById(id);

        if (!user) {
            ctx.throw(404, `There was an error finding user by id, ${id}`)
        } else {
            ctx.body = {
                status: 'OK',
                data: user,
            };
        }
    },
    createUser: async ctx => {
        console.log(ctx.request);
        const { displayName, email } = ctx.request.body;
        let result = null;

        try {
            result = await User.create({
                displayName,
                email,
            });

            ctx.body = {
                status: 'OK',
                data: result,
            };
        } catch (err) {
            if (err.name === 'ValidationError') {
                ctx.throw(400, 'Please provide unique email field to create new user');
            } else {
                throw new Error('There was an error creating user');
            }
        }
    },
    updateUser: async ctx => {
        const newData = { displayName: ctx.request.body.displayName, email: ctx.request.body.email };

        const result = await User.findByIdAndUpdate(ctx.query.id, newData);

        if (!result) {
            throw new Error('There was an error updating user');
        } else {
            ctx.body = {
                status: 'OK',
                data: result,
            };
        }
    },
    deleteUser: async ctx => {
        const result = await User.findByIdAndDelete(ctx.query.id);

        if (!result) {
            throw new Error('There was an error deleting user');
        } else {
            ctx.body = {
                status: 'OK',
            };
        }
    },
};
