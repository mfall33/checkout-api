const { VerificationController } = require("../../Controller");

module.exports = async function (fastify) {

    fastify.get('/verify',
        {
            schema: {
                querystring: {
                    token: { type: 'string' }
                }
            },
        },
        VerificationController.verify)

    fastify.get('/verify-success',
        VerificationController.verifySuccess)


    fastify.get('/verify-failure',
        VerificationController.verifyFailure)

}