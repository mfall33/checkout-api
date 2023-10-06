const t = require('tap');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const mongoClean = require('mongo-clean');
const dotenvExpand = require('dotenv-expand');

const app = require('../Server')();

// INITIALIZING ENVIRONMENT
const env = dotenv.config();
dotenvExpand.expand(env);

async function cleanMongo(url) {
    const c = await mongoose.connect(url)
    await mongoClean(c.connection.db)
    c.disconnect()
}

// t.test('spin up phase - prepare data', async t => {
//     await cleanMongo(process.env.DB_TEST_PATH)
// })

t.test('Accessing products index without a token', async t => {

    t.teardown(() => app.close())

    const response = await app.inject({
        method: 'POST',
        url: '/api/register',
    })

    console.log("Status: " + response.statusCode);

    // forbidden
    t.equal(response.statusCode, 422)

})
