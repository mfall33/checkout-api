const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // unique: true,
        ref: 'User'
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            // unique: true
        },
        quantity: {
            type: Number,
            default: 1,
        }
    }],
},
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    }
);

CartSchema.virtual('total').get(function () {

    try {
        let total = 0;

        console.log("Productos: " + JSON.stringify(this.products))

        for (const item of this.products) {

            const productPrice = item.product.price;
            total += productPrice * item.quantity;

        }

        return total;

    } catch(e) {
        throw new Error(e);
        console.log("Virtual Total: " + e.message);

    }
});

// statics: Can be called directly from the model
// methods: Can be called from an instance of a model

CartSchema.statics.findOrCreate = async function (userId) {

    let cart = await this.findOne({ user: userId });

    if (!cart) {

        cart = new this({
            user: userId,
            products: [],
        });

        await cart.save();
    }

    return cart;

};

CartSchema.methods.addProduct = async function (productId) {
    const productIndex = this.products.findIndex(product =>
        product.product.toString() === productId);

    if (productIndex !== -1) {

        this.products[productIndex].quantity++;

    } else {

        this.products.push({
            product: productId,
            quantity: 1
        });

    }

    await this.save();

};


CartSchema.methods.incrementQuantity = async function (productId) {
    const productIndex = this.products.findIndex(product =>
        product.product.toString() === productId);

    if (productIndex !== -1) {
        this.products[productIndex].quantity++;
    } else {
        throw new Error("Invalid product identifier!");
    }
}


const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;