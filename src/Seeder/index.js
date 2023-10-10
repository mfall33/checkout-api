const { faker } = require("@faker-js/faker");
const { Product } = require("../Database");
const { generateRandomNumber } = require("../Utils");

module.exports.seedProducts = async () => {

    const count = await Product.estimatedDocumentCount();

    console.log("COUNT: " + count);

    if (count <= 0) {

        let products = [];

        const PRODUCTS_TO_SEED = 15;

        const brands = ['Nike', 'Adidas', 'Versace', 'Cedarwood State', 'Puma', 'Columbia']

        for (i = 0; i <= PRODUCTS_TO_SEED; i++) {

            products.push({
                name: faker.commerce.product(),
                price: faker.commerce.price(),
                quantity: generateRandomNumber(1, 100),
                brand: brands[Math.floor(Math.random() * brands.length)]
            })

        }

        // batch insert
        await Product.insertMany(products)

        console.log(`${PRODUCTS_TO_SEED} Products Seeded!`)

    }
}