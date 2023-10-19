const { promises: fsPromises } = require("fs");
const { Logger } = require("../../Utils");

module.exports.webhook = async (request, reply) => {


    // what we need to do is check the status being successful
    // we need to get the customer_id and then retrieve the user and then delete their cart OR move it into orders

    Logger.log(request.body);

    try {
        // Stringify the request body
        const requestBodyJson = JSON.stringify(request.body, null, 2);

        // Specify the file path where you want to save the data
        const filePath = 'stripe_webhook_data.json'; // Change this to your preferred file path

        // Write the stringified request body to a file
        // await fsPromises.writeFile(filePath, requestBodyJson);

        console.log(`Request body has been written to ${filePath}`);

        reply.send("Hello");

    } catch (e) {
        Logger.log(e.message);
        // Handle any errors here
        reply.status(403)
            .type('application/json').send({ message: "Failed to write request body to file" });
    }

}