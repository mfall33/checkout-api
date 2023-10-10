const Stripe = require('stripe');

module.exports.generateRandomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

module.exports.paginationOptions = (req) => {

    return {
        page: parseInt(req.query.page, 10) || 0,
        limit: parseInt(req.query.limit, 10) || 10
    }

}

module.exports.roundDownToNearestTen = (number) => {
    return Math.floor(number / 10) * 10;;
}

module.exports.stripe = () =>
    new Stripe(process.env.STRIPE_SECRET_KEY, {
        maxNetworkRetries: 1,
        timeout: 1000,
    });


module.exports.cleanDB = async (database, url) => {
    try {
        // Connect to the MongoDB instance
        // await database.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

        // Get a list of all collection names in the current database
        const collections = await database.connection.db.listCollections().toArray();

        // Iterate over each collection and drop it
        for (const collection of collections) {
            await database.connection.db.dropCollection(collection.name);
            // console.log(`Dropped collection: ${collection.name}`);
        }
    } catch (error) {
        console.error('Error cleaning MongoDB:', error);
    }
}