const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    maxNetworkRetries: 1,
    timeout: 1000,
});

module.exports = stripe;