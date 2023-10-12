const { AuthController } = require("../../Controller");

module.exports = async function (fastify) {

    fastify.post('/login', {
        schema: {
            body: {
                type: 'object',
                // required: ['email', 'password'],
                properties: {
                    email: { type: 'string' },
                    password: { type: 'string' }
                }
            }
        },
    },
        AuthController.login)

    fastify.post('/register', {
        schema: {
            body: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', minLength: 8 },
                    password: { type: 'string', minLength: 8 }
                }
            }
        },
    },
        AuthController.signup)

}