const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { JWT_EXPIRATION, APP_SECRET_KEY } = process.env;
const { User } = require("../../Database");
const { stripe } = require("../../Utils");

module.exports.login = async (request, reply) => {

    try {

        const user = await User.findOne({ email: request.body.email });

        if (!user || !user.verified) {

            reply.status(403).send({ message: "Unauthorized!!" });

        }

        var passwordIsValid = bcrypt.compareSync(
            request.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return reply.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }

        var token = jwt.sign({ id: user.id }, APP_SECRET_KEY, {
            expiresIn: Number(JWT_EXPIRATION),
        });

        reply.status(200).send({
            email: user.email,
            access_token: token,
            stripe_customer_id: user.stripe_id
        });

    } catch (e) {

        console.log(JSON.stringify(e.message))

        reply.send({ message: "Failed to login" });

    }

}

module.exports.signup = async (request, reply) => {

    try {

        const user = await User.findOne({ email: request.body.email });

        if (user) {

            reply.send({
                message: "This email is already registered!"
            });

            return;

        }

        if (!user) {

            const customer = await stripe.customers.create({
                name: request.body.email,
                email: request.body.email,
            });

            const newUser = new User({
                email: request.body.email,
                password: bcrypt.hashSync(request.body.password),
                stripe_id: customer.id
            });

            if (newUser.save()) {

                reply.send({ message: "User created successfully!" });

            } else {
                throw new Error({ message: "Failed to create user!" })
            }

        }

    } catch (e) {

        reply.send({
            message: e.message
        })

    }

}