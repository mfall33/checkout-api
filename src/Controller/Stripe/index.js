const { Logger } = require("../../Utils");
const { User, Cart } = require("../../Database");

module.exports.webhook = async (request, reply) => {


    // what we need to do is check the status being successful
    // we need to get the customer_id and then retrieve the user and then delete their cart OR move it into orders

    try {

        const customerId = request.body.data.object.customer;

        const user = await User.findOne({ stripe_id: customerId });

        const cart = await Cart.findOne({ user: user.id });

        cart.products = [];

        cart.save();

        reply.send();

    } catch (e) {
        Logger.log(e.message);
        // Handle any errors here
        reply.status(403)
            .type('application/json').send({ message: "Failed to write request body to file" });
    }

}