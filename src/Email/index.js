const nodemailer = require('nodemailer');
const { getEnv } = require('../Utils');

const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS } = getEnv();;

const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASS
    }
});

module.exports = transporter;