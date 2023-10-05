const fastify = require('fastify')();

const { APP_NAME, FRONT_END_URL } = process.env;

const app = () => {

    fastify.setErrorHandler(function (error, request, reply) {

        if (error.validation) {

            const { instancePath, message } = error.validation[0];

            reply.status(422).send(new Error(`${instancePath.substring(1)} - ${message}`));
        }

    });

    // cors handling
    fastify.register(require('@fastify/cors'), {
        origin: ["http://localhost:3000", FRONT_END_URL],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true
    });

    fastify.get("/", async (request, reply) => {
        reply.send(`Welcome to GitHub Actions ARE BLOOODY Working.. ${APP_NAME} API`);
    });

    fastify.register(require('../Route/Stripe'));
    fastify.register(require('../Route/Verification'));

    fastify.register(require('../Route/Auth'), { prefix: 'api/' });
    fastify.register(require('../Route/Products'), { prefix: 'api/' });
    fastify.register(require('../Route/Cart'), { prefix: 'api/' });

    return fastify;
}

module.exports = app;

