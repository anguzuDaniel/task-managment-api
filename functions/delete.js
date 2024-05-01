const { MongoClient, ObjectId } = require('mongodb');
const { Task } = require('../models/Task');

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

        const result = await collection.findOneAndDelete({ _id: ObjectId.createFromHexString(id) });
        
        if (!result) {
            return {
                statusCode: 404,
                body: JSON.stringify('Task not found')
            }
        }
    
        return {
            statusCode: 404,
            body: JSON.stringify('Task deleted successfully')
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify('Failed to delete task')
        }
    }
};

module.exports = { handler };