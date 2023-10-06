const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { JWT_EXPIRATION, APP_SECRET_KEY } = process.env;
const { User } = require("../../Database");
const { stripe } = require("../../Utils");

module.exports.login = async (request, reply) => {

    try {

        const user = await User.findOne({ email: request.body.email });

        if (!user || !user.verified) {

            reply.status(403).send({
                success: false,
                message: "Unauthorized!!",
            });

        }

        var passwordIsValid = bcrypt.compareSync(
            request.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return reply.status(401).send({
                success: false,
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
            stripe_customer_id: user.stripe_id,
            success: true
        });

    } catch (e) {

        reply.send({
            success: false,
            message: "Failed to login"
        });

    }

}

module.exports.signup = async (request, reply) => {

    try {

        const { email, password } = request.body;

        const user = await User.findOne({ email: email });

        if (user) {

            reply.status(409)
                .send({
                    success: false,
                    message: "This email is already registered!"
                });

            return;

        }

        if (!user) {

            const stripeCustomer = await stripe.customers.create({
                name: email,
                email: email,
            });

            const newUser = new User({
                email: email,
                password: bcrypt.hashSync(password),
                stripe_id: stripeCustomer.id
            });

            if (newUser.save()) {

                reply.status(201)
                    .send({
                        success: true,
                        message: "User created successfully!"
                    });

            } else {

                throw new Error({ message: "Failed to create user!" });

            }

        }

    } catch (e) {

        reply.send({
            message: e.message,
            success: false
        })

    }

}