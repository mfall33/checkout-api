const mongoose = require('mongoose');

const db = {};

const { Product, User, UserVerifyToken, Cart } = require("./Models")

db.Cart = Cart;
db.User = User;
db.Product = Product;
db.UserVerifyToken = UserVerifyToken;

db.mongoose = mongoose;

module.exports = db;