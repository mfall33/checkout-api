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

module.exports.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    maxNetworkRetries: 1,
    timeout: 1000,
});

module.exports.getEnv = () => {

    if (process.env.NODE_ENV === 'testing') {
        process.env.DB_PATH = process.env.DB_TEST_PATH;
    }

    return process.env;
}