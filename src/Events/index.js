const crypto = require('crypto');
const EventEmitter = require('events').EventEmitter;

const transporter = require('../Email');
const UserVerifyToken = require('../Database/Models/UserVerifyToken');

const { SERVER_BASE_URL } = process.env;

const AuthEvent = new EventEmitter();

AuthEvent.on('new-user', async (user) => {

    try {

        const token = crypto.randomBytes(16).toString('hex');

        const userVerifyToken = new UserVerifyToken({
            user: user._id,
            token: token
        });

        await userVerifyToken.save();

        await transporter.sendMail({
            from: 'tester@gmail.com',
            to: user.email,
            subject: "Welcome to CheckOut!",
            text: "Your CheckOut account has been registered!",
            html: `<a href="${SERVER_BASE_URL}/verify?token=${userVerifyToken.token}">Verify your Account</h1>`,
        })

    } catch (e) {

        console.log("Failed to send/create token!: " + JSON.stringify(e.message));

    }

})

module.exports.AuthEvent = AuthEvent;