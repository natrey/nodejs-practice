const mongoose = require('mongoose');
const beautifyUnique = require('@noname-land/mongoose-beautiful-unique-validation');

const UserSchema = new mongoose.Schema(
    {
        displayName: String,
        email: {
            type: String, // https://docs.mongodb.com/manual/reference/bson-types/index.html
            required: 'Enter an email',
            unique: 'Two users cannot share the same email ({VALUE})',
            validate: [{
                validator(value) { return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value) },
                msg: 'Please enter correct email.'
            }],
            lowercase: true,
            trim: true
        },
    },
    {
        timestamps: true // createdAt, updatedAt
    }
);

UserSchema.plugin(beautifyUnique);

module.exports = mongoose.model('User', UserSchema);
