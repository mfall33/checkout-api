const { Cart, Product } = require("../../Database/Models")

module.exports.index = async (request, reply) => {

    try {

        const cart = await Cart.findOrCreate(request.userId);

        await cart.populate('products.product');

        reply.status(201).send(cart);

    } catch (e) {

        reply.status(403)
            .type('application/json').send({ message: "Failed to retrieve Cart" });

    }

}

module.exports.addItem = async function (request, reply) {

    try {

        const { productId, userId } = request.body;

        // validate the product to see if it exists
        await validateProduct(productId, userId, reply);

        // Find or create a cart for the user
        const cart = await Cart.findOrCreate(request.userId);

        // Add the product to the cart
        await cart.addProduct(productId);

        // Populate the cart with product details
        await cart.populate('products.product');

        reply.send(cart);

    } catch (e) {
        console.log("Add Item: " + e.message)
        reply.status(403)
            .type('application/json').send({ message: "Failed to add Cart item" });

    }
};

module.exports.setQuantity = async (request, reply) => {

    try {

        const { productId, quantity, userId } = request.body;

        await validateProduct(productId, userId, reply);

        const cart = await Cart.findOne({
            user: request.userId
        })

        const productIndex = cart.products
            .findIndex(product =>
                product.product.toString() === request.body.productId);


        if (quantity > 0) {
            cart.products[productIndex].quantity = quantity;
        }

        await cart.save();

        await cart.populate('products.product');

        reply.send(cart);

    } catch (e) {

        reply.status(403)
            .type('application/json').send({ message: "Failed to decrement Cart item quantity" });

    }

}

module.exports.removeItem = async (request, reply) => {

    try {

        const { productId, userId } = request.body;

        await validateProduct(productId, userId, reply);

        const cart = await Cart.findOne({
            user: request.userId
        });

        if (cart) {

            const productIndex = cart.products
                .findIndex(cartProduct =>
                    cartProduct.product.toString() === request.body.productId);

            if (productIndex > -1) {
                cart.products.splice(productIndex, 1);
            }

            await cart.save();

            await cart.populate('products.product');

            reply.send(cart);

        }

        reply.send("Nothing in cart!");

    } catch (e) {

        reply.status(403)
            .type('application/json').send({ message: "Failed to remove item" })

    }

}

const validateProduct = async (productId, userId) => {

    try {

        const product = await Product.findOne({
            _id: productId,
            user: userId
        });

        if (!product) {
            throw new Error("Invalid Product!");
        }

        return product;

    } catch (e) {

        throw new Error("Invalid Product!");

    }

} 