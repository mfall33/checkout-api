require('dotenv').config()

const server = require('./Server');
const { seedProducts } = require('./Seeder');
const { mongoose: DB } = require('./Database');
const { PORT, DB_USER, DB_PASS, DB_NAME } = process.env;

DB.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@${DB_NAME}.faxceg5.mongodb.net/?retryWrites=true&w=majority`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
    .then(async () => {
        console.log("DB Connection established...");
        await seedProducts();
    })
    .catch((err) => {
        console.log("db_user: " + process.env.DB_USER);
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