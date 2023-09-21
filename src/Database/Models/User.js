const mongoose = require('mongoose');
const { AuthEvent } = require('../../Events');

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    stripe_id: String,
    verified: {
        type: Boolean,
        default: false
    }
});

UserSchema.post('save', function (user) {

    AuthEvent.emit('new-user', this)

})

const User = mongoose.model(
    "User",
    UserSchema
);

module.exports = User;