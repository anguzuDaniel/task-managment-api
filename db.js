const { MongoClient } = require('mongodb');

const username = encodeURIComponent(process.env.DB_USER_NAME)
const password = encodeURIComponent(process.env.DB_PASSWORD)
const clusterUrl = process.env.DB_CLUSTER
const authMechanism = 'DEFAULT';

const dbUri = `mongodb+srv://${username}:${password}@${clusterUrl}`;

console.log(`Connection String: ${dbUri}`);

async function connectToDatabase() {
  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(dbUri);

  try {
    await client.connect();
    console.log('Connect to MongoDB Atlas');
    const database = client.db('task-manager');
    return database
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
  } finally {
    // Close the client connection
    await client.close();
  }
}

module.exports = { connectToDatabase };