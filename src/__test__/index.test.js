const { mongoose: DB } = require('../Database');
const { cleanDB } = require('../Utils');

const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const server = require('../Server');
const { seedProducts } = require('../Seeder');
const app = server();

// INITIALIZING ENVIRONMENT
const env = dotenv.config();
dotenvExpand.expand(env);

const { DB_PATH } = process.env;

beforeAll(async () => {

    await DB.connect(DB_PATH, { useNewUrlParser: true, useUnifiedTopology: true });
    
    await cleanDB(DB, DB_PATH);

    await seedProducts();

});

afterAll(async () => {

    await app.close();

});

require("./authTests")(app);