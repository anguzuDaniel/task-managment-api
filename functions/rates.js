const { MongoClient } = require('mongodb');
const { Task } = require('../models/Task');
require('dotenv').config();

const mongoClient = new MongoClient(process.env.MONGODB_URI);

const clientPromise = mongoClient.connect();

const handler = async (event) => {
    try {
        const stats = await Task.aggregate([
            { $group: { _id: "$completed", count: { $sum: 1 } } }
        ]);
        return {
            statusCode: 200,
            body: JSON.stringify(stats)
        }
    } catch (error) {
        return { statusCode: 500, body: error.toString() }
    }
};

module.exports = { handler };
