require('dotenv').config()

const fastify = require('fastify')();
const { mongoose } = require('./Database');
const { seedProducts } = require('./Seeder');
const { PORT, DB_USER, DB_PASS, DB_NAME, APP_NAME, FRONT_END_URL } = process.env;

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@${DB_NAME}.faxceg5.mongodb.net/?retryWrites=true&w=majority`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
    .then(async () => {
        console.log("DB Connection established...");
        await seedProducts();
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
    origin: ["http://localhost:3000", FRONT_END_URL],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
})

fastify.get("/", async (request, reply) => {
    reply.send(`Welcome to GitHub Actions Working.. ${APP_NAME} API`);
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

});