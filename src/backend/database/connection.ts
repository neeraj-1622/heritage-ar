
import { MongoClient, ServerApiVersion } from 'mongodb';

// Use a connection string to your MongoDB deployment
const uri = "mongodb://localhost:27017/heritageAR";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function connectToDatabase() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Connected to MongoDB successfully");
    
    // Get the database
    const db = client.db("heritageAR");
    return { client, db };
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

export async function closeDatabaseConnection() {
  try {
    await client.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  }
}
