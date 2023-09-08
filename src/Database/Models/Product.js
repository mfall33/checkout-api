const mongoose = require('mongoose');
const { paginationOptions, roundDownToNearestTen } = require('../../Utils');

const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    stock: Number,
    brand: String
})

const Product = mongoose.model(
    "Product",
    ProductSchema
);

module.exports = Product;

module.exports.findProducts = async (request, reply) => {

    try {

        const { page, limit } = paginationOptions(request);

        count = await Product.count();

        const products = await Product
            .find({})
            .sort({ name: 'ascending' })
            .limit(limit)
            .skip(page * limit);

        let resObj = {};
        resObj.products = products;
        resObj.page = page;

        // Show previous page if we're past the first one
        if (page > 0)
            resObj.previous_page = page - 1;

        // Show next page if 
        if ((page * limit) < roundDownToNearestTen(count))
            resObj.next_page = page + 1;

        reply.send(resObj);

    } catch (e) {
        console.log("ERROR: " + JSON.stringify(e.message))
    }

}