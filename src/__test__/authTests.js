module.exports = (app) => {

    let productId = null;

    test('Registering and then Logging in User', async function () {

        const registerResponse = await app.inject({
            method: 'POST',
            url: '/api/register',
            body: {
                email: `tester@gmail.com`,
                password: 'Password123'
            }
        });

        expect(registerResponse.statusCode).toBe(201);

        // wait for user to be added..
        await new Promise(resolve => setTimeout(resolve, 4000));

        const loginResponse = await app.inject({
            method: 'POST',
            url: '/api/login',
            body: {
                email: 'tester@gmail.com',
                password: 'Password123'
            }
        });

        const { access_token } = loginResponse.json();

        global.access_token = access_token;

        expect(loginResponse.statusCode).toBe(200);

    });

    test('Product Index Route', async function () {

        const productIndexResponse = await app.inject({
            method: 'GET',
            url: '/api/products',
            headers: {
                'x-access-token': global.access_token
            }
        });

        const { products } = productIndexResponse.json();

        productId = products[0]._id;

    });

    test('Product Show Route', async function () {

        const productIndexResponse = await app.inject({
            method: 'GET',
            url: `/api/products/${productId}`,
            headers: {
                'x-access-token': global.access_token
            }
        });

        expect(productIndexResponse.statusCode).toBe(200);

    });
}