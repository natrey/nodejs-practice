const User = require('../model/User');

module.exports = {
    getUsers: async ctx => {
        const users = await User.find({});

        if (!users) {
            throw new Error('There was an error finding users');
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
            ctx.status = 404;
            throw new Error(`There was an error finding user by id, ${id}`);
        } else {
            ctx.body = {
                status: 'OK',
                data: user,
            };
        }
    },
    createUser: async ctx => {
        const { displayName, email } = ctx.request.body;

        if (!email) {
            ctx.status = 400;
            throw new Error('Please provide email field to create new user');
        }

        const result = await User.create({
            displayName,
            email,
        });

        if (!result) {
            throw new Error('There was an error creating user');
        } else {
            ctx.body = {
                status: 'OK',
                data: result,
            };
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
