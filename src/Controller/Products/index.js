const { Product } = require("../../Database");

module.exports.index = async (request, reply) => {

    try {

        return await Product.findProducts(request, reply);
        
    } catch (e) {

        console.log(e.message);
        reply.send({ message: "Failed to retrieve products" });
    }

}

module.exports.show = async (request, reply) => {

    try {

        const product = await Product.findById(request.params.id)

        reply.send(product);

    } catch (e) {

        reply.send({ message: "Failed to retrieve product" });

    }

}