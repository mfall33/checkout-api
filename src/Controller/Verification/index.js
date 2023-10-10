
const { UserVerifyToken } = require("../../Database/Models");

module.exports.verify = async (request, reply) => {

    try {

        const userVerifyToken = await UserVerifyToken.findOne({
            token: request.query.token
        }).populate('user');

        if (userVerifyToken) {

            const user = userVerifyToken.user;

            user.verified = true;
            await user.save();

            // be done with the token
            await UserVerifyToken.deleteOne({ _id: userVerifyToken._id });

            reply.redirect('/verify-success')

        }


    } catch (e) {

        reply.redirect('/verify-failure')

    }

}

module.exports.verifySuccess = async (request, reply) => {

    reply.type('text/html')
        .send(`Your account has been verified!`)

}

module.exports.verifyFailure = async (request, reply) => {

    reply.type('text/html')
        .send(`Failed to verify account, please try again!`)

}