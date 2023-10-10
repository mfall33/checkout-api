const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const { mongoose: DB } = require('../Database');

const server = require('../Server');
const app = server();
const { getEnv, cleanDB } = require('../Utils');

// INITIALIZING ENVIRONMENT
const env = dotenv.config();
dotenvExpand.expand(env);

const { DB_PATH } = getEnv();

beforeAll(async () => {

    await DB.connect(DB_PATH, { useNewUrlParser: true, useUnifiedTopology: true });
    await cleanDB(DB, DB_PATH);

});

afterAll(async () => {

    await app.close();

})

test('Registering User', async function () {

    const regResponse = await app.inject({
        method: 'POST',
        url: '/api/register',
        body: {
            email: 'tester@gmail.com',
            password: 'Password123'
        }
    });

    expect(regResponse.statusCode).toBe(201);

});

test('Logging in unverified User', async function () {

    const regResponse = await app.inject({
        method: 'POST',
        url: '/api/login',
        body: {
            email: 'tester@gmail.com',
            password: 'Password123'
        }
    });

    expect(regResponse.statusCode).toBe(403);

});