const { MongoClient } = require('mongodb');

console.log(`Connection String: ${process.env.MONGODB_URI}`);

async function connectToDatabase() {
  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('Connect to MongoDB Atlas');
    const database = client.db(process.env.MONGODB_DATABASE);
    return database
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
  } finally {
    // Close the client connection
    await client.close();
  }
}

module.exports = { connectToDatabase };