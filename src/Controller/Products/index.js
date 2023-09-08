const { Product } = require("../../Database");

module.exports.index = async (request, reply) => {

    try {

        return await Product.findProducts(request, reply);

    } catch (e) {
        reply.send({ message: "Failed to retrieve product" });
    }

}

module.exports.show = async (request, reply) => {

    try {

        const product = await Product.findById(request.params.id)
        reply.send(product);

    } catch (e) {
        reply.send({ message: "Failed to retrieve product" })
    }

}