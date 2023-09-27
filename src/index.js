require('dotenv').config()

const fastify = require('fastify')();
const { mongoose } = require('./Database');
const { seedProducts } = require('./Seeder');
const { PORT, DB_USER, DB_PASS, DB_NAME } = process.env;


// mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@${DB_NAME}.faxceg5.mongodb.net/?retryWrites=true&w=majority`, {
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
// })
// .then(() => {
//     console.log("DB Connection established...");
//     initialize();
// })
// .catch((err) => {
//     console.log("db_user: " + process.env.DB_USER);
//     if (err) throw err;
// });

// fastify.addHook('preHandler', (req, res, done) => {

//     // only in development..

//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization, x-access-token");
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");

//     const isPreflight = /options/i.test(req.method);

//     if (isPreflight) {
//         return res.send();
//     }

//     done();
// });

// fastify.setErrorHandler(function (error, request, reply) {

//     if (error.validation) {

//         const { instancePath, message } = error.validation[0];

//         reply.status(422).send(new Error(`${instancePath.substring(1)} - ${message}`));
//     }

// });

fastify.get("/", (request, reply) => { reply.send("<h1>Hello!</h1>") });

// fastify.register(require('./Route/Stripe'))
// fastify.register(require('./Route/Verification'))

// fastify.register(require('./Route/Auth'), { prefix: 'api/' })
// fastify.register(require('./Route/Products'), { prefix: 'api/' })
// fastify.register(require('./Route/Cart'), { prefix: 'api/' })

fastify.listen({ port: PORT }, function (err) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }

    console.log(`App listening on port: ${PORT}`);

})

const initialize = async () => {
    await seedProducts();
}