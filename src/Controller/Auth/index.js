const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { User } = require("../../Database");
const { stripe, ErrorHandler } = require("../../Utils");
const { loginFields, registerFields } = require("../../Requests");

const { NODE_ENV } = process.env;

module.exports.login = async (request, reply) => {

    try {

        const errors = new ErrorHandler();

        errors.validateRequest(request.body, loginFields);

        if (errors.hasErrors()) {
            return reply.status(422).type('application/json').send(errors);
        }

        const user = await User.findOne({ email: request.body.email });

        if (!user || !user.verified) {

            return reply.status(403).type('application/json').send({
                success: false,
                message: "Unauthorized!!",
            });

        } else {

            var passwordIsValid = bcrypt.compareSync(
                request.body.password,
                user.password
            );

            if (!passwordIsValid) {

                return reply.status(401).type('application/json').send({
                    success: false,
                    accessToken: null,
                    message: "Invalid Password or Email!"
                });

            }

            const token = jwt.sign({ id: user.id }, process.env.APP_SECRET_KEY, {
                expiresIn: Number(process.env.JWT_EXPIRATION),
            });

            return reply.status(200).type('application/json').send({
                email: user.email,
                access_token: token,
                stripe_customer_id: user.stripe_id,
                success: true
            });

        }

    } catch (e) {

        console.log("LoginErr: " + e.message)

        return reply.status(403)
            .type('application/json').send({
                success: false,
                message: "Failed to login"
            });

    }

}

module.exports.signup = async (request, reply) => {

    try {

        const errors = new ErrorHandler();

        errors.validateRequest(request.body, registerFields);

        const { email, password } = request.body;

        const user = await User.findOne({ email: email });

        if (user) {

            errors.addError("email", "This email is already registered!")

        }

        if (errors.hasErrors()) {
            return reply.status(422).type('application/json').send({
                success: false,
                ...errors
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
                    .type('application/json').send({
                        success: true,
                        message: "User created successfully!"
                    });

            } else {

                throw new Error({ message: "Failed to create user!" });

            }

        }

    } catch (e) {

        return reply.status(403)
            .type('application/json').send({
                message: e.message,
                success: false
            })

    }

}