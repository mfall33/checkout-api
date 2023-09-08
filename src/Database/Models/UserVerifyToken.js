const mongoose = require('mongoose');

const UserVerifyTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
});

const UserVerifyToken = mongoose.model(
    "UserVerifyToken",
    UserVerifyTokenSchema
);

module.exports = UserVerifyToken;