
const { ProductController } = require("../../Controller");
const { authorizeJwt, verifyUser } = require("../../Middleware");

module.exports = async function (fastify) {

    fastify.get('/products',
        { preHandler: [authorizeJwt, verifyUser] },
        ProductController.index
    )

    fastify.get('/products/:id',
        { preHandler: [authorizeJwt, verifyUser] },
        ProductController.show)

}