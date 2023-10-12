const fastify = require('fastify');

const { APP_NAME, FRONT_END_URL } = process.env;

const build = (opts = {}) => {

    const app = fastify(opts);

    // cors handling
    app.register(require('@fastify/cors'), {
        origin: ["http://localhost:3000", FRONT_END_URL],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true
    });

    app.get("/", async (request, reply) => {
        reply.send(`Welcome to ${APP_NAME} API`);
    });

    app.register(require('../Route/Stripe'));
    app.register(require('../Route/Verification'));

    app.register(require('../Route/Auth'), { prefix: 'api/' });
    app.register(require('../Route/Products'), { prefix: 'api/' });
    app.register(require('../Route/Cart'), { prefix: 'api/' });

    return app;

}

module.exports = build;

