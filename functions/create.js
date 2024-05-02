const { MongoClient, ObjectId } = require('mongodb');
const { Task }  = require('../models/Task')
require('dotenv').config();

const mongoClient = new MongoClient(process.env.MONGODB_URI);

const clientPromise = mongoClient.connect();

const handler = async (event) => {
    try {
        
        const { title, description, tags, dueDate, reminders, notifications } = event.req.body;

        if (!title) {
            return res.status(400).json({ message: 'Invalid request' })           
        }

        const newTask = new Task({ title, description, tags, dueDate, reminders, notifications });
        await newTask.save();

        return {
            statusCode: 201,
            body: JSON.stringify(newTask)
        }
    } catch (error) { 
        return { statusCode: 500, body: error.toString() }
    }
};

module.exports = { handler };
