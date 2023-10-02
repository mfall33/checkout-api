require('dotenv').config()

const fastify = require('fastify')();
const fastifyCors = require('fastify-cors');
const fs = require('fs');
const util = require('util');
const { mongoose } = require('./Database');
const { seedProducts } = require('./Seeder');
const { PORT, DB_USER, DB_PASS, DB_NAME, APP_NAME, FRONT_END_URL } = process.env;

const readFile = util.promisify(fs.readFile);
const path = require('path');

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@${DB_NAME}.faxceg5.mongodb.net/?retryWrites=true&w=majority`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
    .then(() => {
        console.log("DB Connection established...");
        initialize();
    })
    .catch((err) => {
        console.log("db_user: " + process.env.DB_USER);
        if (err) throw err;
    });


fastify.setErrorHandler(function (error, request, reply) {

    if (error.validation) {

        const { instancePath, message } = error.validation[0];

        reply.status(422).send(new Error(`${instancePath.substring(1)} - ${message}`));
    }

});

fastify.register(require('@fastify/cors'), {
    hook: 'preHandler',
    delegator: (req, callback) => {
        const corsOptions = {
            // This is NOT recommended for production as it enables reflection exploits
            origin: FRONT_END_URL,
            methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE']
        };

        console.log("Origin: " + req.headers.origin);

        // do not include CORS headers for requests from localhost
        if (/^localhost$/m.test(req.headers.origin)) {

            console.log("Origin set to false");
            corsOptions.origin = false;
        }

        // callback expects two parameters: error and options
        callback(null, corsOptions)
    },
})

fastify.get("/", (request, reply) => {
    reply.send(`Welcome to ${APP_NAME} API`);
});

fastify.get("/.well-known/pki-validation/DC9608000F86B10A12E7188D10D4862C.txt", async (request, reply) => {

    try {

        const file = path.resolve('./DC9608000F86B10A12E7188D10D4862C.txt')
        const stream = await readFile(file);

        return reply.type('text/html').send(stream);

    } catch (e) {
        console.log(e.message);
        reply.send("File not found");
    }

});

fastify.register(require('./Route/Stripe'))
fastify.register(require('./Route/Verification'))

fastify.register(require('./Route/Auth'), { prefix: 'api/' })
fastify.register(require('./Route/Products'), { prefix: 'api/' })
fastify.register(require('./Route/Cart'), { prefix: 'api/' })

fastify.listen({ port: PORT, host: '0.0.0.0' }, function (err) {
    if (err) {
        console.log("Error: " + JSON.stringify(err))
        process.exit(1)
    }

    console.log(`App listening on port: ${PORT}`);

})

const initialize = async () => {
    await seedProducts();
}