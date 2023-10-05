const fastify = require('fastify');

const { APP_NAME, FRONT_END_URL } = process.env;

const build = (opts = {}) => {

    const app = fastify(opts);

    app.setErrorHandler(function (error, request, reply) {

        if (error.validation) {

            const { instancePath, message } = error.validation[0];

            reply.status(422).send(new Error(`${instancePath.substring(1)} - ${message}`));
        }

    });

    // cors handling
    app.register(require('@fastify/cors'), {
        origin: ["http://localhost:3000", FRONT_END_URL],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true
    });

    app.get("/", async (request, reply) => {
        reply.send(`Welcome to GitHub Actions ARE BLOOODY Working.. ${APP_NAME} API`);
    });

    app.register(require('../Route/Stripe'));
    app.register(require('../Route/Verification'));

    app.register(require('../Route/Auth'), { prefix: 'api/' });
    app.register(require('../Route/Products'), { prefix: 'api/' });
    app.register(require('../Route/Cart'), { prefix: 'api/' });

    return app;
    
}

module.exports = build;

