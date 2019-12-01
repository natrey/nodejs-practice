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
        const { displayName, email } = ctx.request.body;

        try {
            const result = await User.create({
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
        const { displayName, email } = ctx.request.body;
        const newData = {};
        if (displayName) newData.displayName = displayName;
        if (email) newData.email = email;

        try {
            const result = await User.findByIdAndUpdate(ctx.params.id, newData);

            ctx.body = {
                status: 'OK',
                data: result,
            };
        } catch (err) {
            if (err.name === 'CastError') {
                ctx.throw(404, 'User does not exist');
            } else {
                throw new Error(`There was an error updating user, ${err}`);
            }
        }
    },
    deleteUser: async ctx => {
        try {
            await User.findByIdAndDelete(ctx.params.id);

            ctx.body = {
                status: 'OK',
            };
        } catch (err) {
            if (err.name === 'CastError') {
                ctx.throw(404, 'User does not exist');
            } else {
                throw new Error(`There was an error deleting user ${err}`);
            }
        }
    },
};
