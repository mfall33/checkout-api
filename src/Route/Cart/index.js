const { CartController } = require("../../Controller");
const { authorizeJwt, verifyUser } = require("../../Middleware");

module.exports = async function (fastify) {

    fastify.get('/cart',
        { preHandler: [authorizeJwt, verifyUser] },
        CartController.index
    )

    fastify.post('/cart',
        { preHandler: [authorizeJwt, verifyUser] },
        CartController.addItem
    );

    fastify.patch('/cart/decrement',
        { preHandler: [authorizeJwt, verifyUser] },
        CartController.decrementQuantity
    )

    fastify.delete('/cart',
        { preHandler: [authorizeJwt, verifyUser] },
        CartController.removeItem
    )

}