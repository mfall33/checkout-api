const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { User } = require("../../Database");
const { stripe } = require("../../Utils");

const { NODE_ENV, APP_SECRET_KEY, JWT_EXPIRATION } = process.env;

module.exports.login = async (request, reply) => {

    try {

        const user = await User.findOne({ email: request.body.email });

        if (!user || !user.verified) {

            return reply.status(403).send({
                success: false,
                message: "Unauthorized!!",
            });

        } else {

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

            const token = jwt.sign({ id: user.id }, process.env.APP_SECRET_KEY, {
                expiresIn: Number(process.env.JWT_EXPIRATION),
            });

            return reply.status(200).send({
                email: user.email,
                access_token: token,
                stripe_customer_id: user.stripe_id,
                success: true
            });

        }

    } catch (e) {

        return reply.status(403)
            .send({
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

            return reply.status(409)
                .send({
                    success: false,
                    message: "This email is already registered!"
                });

        }

        if (!user) {

            const stripeCustomer = await stripe().customers.create({
                name: email,
                email: email,
            });

            const newUser = new User({
                email: email,
                password: bcrypt.hashSync(password),
                stripe_id: stripeCustomer.id
            });

            if (NODE_ENV === 'testing') {
                newUser.verified = true;
            }

            if (newUser.save()) {

                return reply.status(201)
                    .send({
                        success: true,
                        message: "User created successfully!"
                    });

            } else {

                throw new Error({ message: "Failed to create user!" });

            }

        }

    } catch (e) {

        console.log("REGISTER: " + e.message);

        return reply.status(403)
            .send({
                message: e.message,
                success: false
            })

    }

}