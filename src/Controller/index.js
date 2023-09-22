const AuthController = require('./Auth');
const ProductController = require('./Products');
const VerificationController = require('./Verification');
const CartController = require('./Cart');
const StripeController = require('./Stripe');

module.exports = {
    AuthController: AuthController,
    ProductController: ProductController,
    VerificationController: VerificationController,
    CartController: CartController,
    StripeController: StripeController
}