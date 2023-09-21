require('dotenv').config()

const fastify = require('fastify')();
const { faker } = require('@faker-js/faker');
const DB = require('./Database');
const { generateRandomNumber } = require('./Utils');

const { Product } = DB;
const { DB_PATH, PORT } = process.env;

DB.mongoose.connect(DB_PATH)
    .then(() => {
        console.log("DB Connection established...");
        initialize();
    })
    .catch((err) => {
        if (err) throw err;
    });

fastify.addHook('preHandler', (req, res, done) => {

    // only in development..

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization, x-access-token");

    const isPreflight = /options/i.test(req.method);
    if (isPreflight) {
        return res.send();
    }

    done();
})

fastify.register(require('./Route/Auth'), { prefix: 'api/' })
fastify.register(require('./Route/Products'), { prefix: 'api/' })
fastify.register(require('./Route/Cart'), { prefix: 'api/' })
fastify.register(require('./Route/Verification'))

fastify.listen({ port: PORT }, function (err) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})

const initialize = () => {
    Product
        .find({})
        .estimatedDocumentCount()
        .then(async (count) => {
            if (count <= 0) {
                // seeder

                let products = [];

                const brands = ['Nike', 'Adidas', 'Versace', 'Cedarwood State', 'Puma', 'Columbia']

                // create 30 products
                for (i = 0; i < 16; i++) {

                    products.push({
                        name: faker.commerce.product(),
                        price: faker.commerce.price(),
                        quantity: generateRandomNumber(1, 100),
                        brand: brands[Math.floor(Math.random() * brands.length)]
                    })

                }

                try {

                    await Product.insertMany(products)

                } catch (e) {
                    console.log("ERROR: " + JSON.stringify(e));
                }

            }
        })
        .catch(err => console.log("ERR: " + err));
}