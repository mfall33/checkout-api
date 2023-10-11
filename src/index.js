// INITALIZING ENV
const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')

const env = dotenv.config();
dotenvExpand.expand(env);

const server = require('./Server');
const { seedProducts } = require('./Seeder');
const { mongoose: DB } = require('./Database');

const { PORT, DB_PATH } = process.env;

DB.connect(DB_PATH, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
    .then(async () => {
        console.log("DB Connection established...");
        await seedProducts();
    })
    .catch((err) => {

        if (err) process.exit(1);
        // we need to replace this ^ with some kind of remote error logging..
    });

const app = server({
    logger: {
        level: 'info',
        transport: {
            target: 'pino-pretty'
        }
    }
});


app.listen({ port: PORT, host: '0.0.0.0' }, async (err) => {

    if (err) {
        console.log("Error: " + JSON.stringify(err.message))
        process.exit(1);
    }

    console.log(`App listening on port: ${PORT}`);

});