
const { StripeController } = require("../../Controller");

module.exports = async function (fastify) {

    fastify.post('/webhook',
        StripeController.webhook)

}