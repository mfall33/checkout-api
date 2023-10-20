const { Logger } = require("../../Utils");
const { User, Cart } = require("../../Database");
const transporter = require('../../Email');

const { APP_NAME, MAIL_FROM } = process.env;

module.exports.webhook = async (request, reply) => {


    // what we need to do is check the status being successful
    // we need to get the customer_id and then retrieve the user and then delete their cart OR move it into orders

    try {

        Logger.log(request.body.type);

        const customerId = request.body.data.object.customer;

        const user = await User.findOne({ stripe_id: customerId });

        const cart = await Cart.findOne({ user: user.id });

        cart.products = [];

        await cart.save();

        await transporter.sendMail({
            from: MAIL_FROM,
            to: user.email,
            subject: `${APP_NAME} | Your Order!`,
            text: `Your order has been placed!`,
        })

        reply.send();

    } catch (e) {
        Logger.log(e.message);
        // Handle any errors here
        reply.status(403)
            .type('application/json').send({ message: "Failed to write request body to file" });
    }

}