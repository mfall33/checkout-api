const { AuthController } = require("../../Controller");

module.exports = async function (fastify) {

    fastify.post('/login', {
        schema: {
            body: {
                type: 'object'
            }
        },
    },
        AuthController.login)

    fastify.post('/register', {
        schema: {
            body: {
                type: 'object'
            }
        },
    },
        AuthController.signup)

}