const { MongoClient } = require('mongodb');

const mongoClient = new MongoClient(process.env.MONGODB_URI);

const clientPromise = mongoClient.connect();

const handler = async (event) => {
    try {
        const { queryStringParameters } = event;
        const { page = 1, limit = 10, title, completed, dueDate, tags, sortBy = 'createdAt', sortOrder = 'desc' } = queryStringParameters;
        const skip = (page - 1) * limit;
        
        const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
        const collection = database.collection(process.env.MONGODB_COLLECTION);

        let query = {};
        // Apply filters
        if (title) query.title = { $regex: title, $options: 'i' };
        if (completed) query.completed = completed === 'true';
        if (dueDate) query.dueDate = { $gte: new Date(dueDate) };
        if (tags) query.tags = { $in: tags.split(',') };

        // Count total matching documents
        const totalDocuments = await collection.countDocuments(query);

        // Sort and paginate the results
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
        const results = await collection.find(query).sort(sortOptions).skip(skip).limit(limit).toArray();

        console.log("Results: " + results);

        return {
            statusCode: 200,
            body: JSON.stringify(results),
            headers: {
                'Content-Type': 'application/json'
            },
        }
    } catch (error) {
        return { statusCode: 500, body: error.toString() }
    }
}

module.exports = { handler }