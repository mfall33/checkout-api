const crypto = require('crypto');
const EventEmitter = require('events').EventEmitter;

const transporter = require('../Email');
const UserVerifyToken = require('../Database/Models/UserVerifyToken');

const { SERVER_BASE_URL, APP_NAME, MAIL_FROM, NODE_ENV } = process.env;

const AuthEvent = new EventEmitter();

AuthEvent.on('new-user', async (user) => {

    try {

        // if testing then kill
        if (NODE_ENV === 'testing') {
            return;
        }

        // create new verification token
        const token = crypto.randomBytes(16).toString('hex');

        const userVerifyToken = new UserVerifyToken({
            user: user._id,
            token: token
        });

        await userVerifyToken.save();

        await transporter.sendMail({
            from: MAIL_FROM,
            to: user.email,
            subject: `Welcome to ${APP_NAME}!`,
            text: `Your ${APP_NAME} account has been registered!`,
            html: `<a href="${SERVER_BASE_URL}/verify?token=${userVerifyToken.token}">Verify your Account</h1>`,
        })

    } catch (e) {

        console.log("Failed to send/create token!: " + JSON.stringify(e.message));

    }

})

module.exports.AuthEvent = AuthEvent;