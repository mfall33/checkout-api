const mongoose = require('mongoose');

const db = {};

const { Product, User, UserVerifyToken } = require("./Models")

db.User = User;
db.Product = Product;
db.UserVerifyToken = UserVerifyToken;

db.mongoose = mongoose;

module.exports = db;