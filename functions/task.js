const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const mongoClient = new MongoClient(process.env.MONGODB_URI);

const clientPromise = mongoClient.connect();

const handler = async (event) => {
    try {
        const { queryStringParameters } = event;
        const { id } = queryStringParameters;

        if (!ObjectId.isValid(id)) {
            return {
                statusCode: 400,
                body: JSON.stringify('Invalid ID format')
            };
        }

        const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
        const collection = database.collection(process.env.MONGODB_COLLECTION);

        if (!id) {
            return {
                statusCode: 400,
                body: 'Task ID is required',
            };
        }

        // Retrieve the task by ID
        const task = await collection.findOne({ _id: ObjectId.createFromHexString(id) });

        console.log(task);

        // Check if the task exists
        if (!task) {
            return {
                statusCode: 404,
                body: 'Task not found',
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(task),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: error.toString(),
        };
    }
};

module.exports = { handler };
