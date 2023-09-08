const { AuthController } = require("../../Controller");
const { verifyUser } = require("../../Middleware");

module.exports = async function (fastify) {

    fastify.post('/login',
        AuthController.login)

    fastify.post('/register',
        AuthController.signup)

}