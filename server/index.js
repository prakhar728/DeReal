// Import required modules
const express = require("express");
var cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

// Create a new Express application
const app = express();
app.use(cors());
const port = process.env.PORT || 5000;
var client;
var database;

async function connectToDB() {
  const uri = process.env.MONGO_URI || "";
  client = new MongoClient(uri);
  client.connect();
  database = client.db("smart_contract_index");
}

// Connect to MongoDB and fetch all data from a collection
app.get("/ads", async (req, res) => {
  try {
  await connectToDB();

    // Define the database and collection you want to use
    const collection = database.collection("EventLogs_AdSubmitted");

    // Fetch all documents from the collection
    const data = await collection.find({}).toArray();

    // Send the data as JSON
    res.json(data);
  } catch (error) {
    console.error("Error connecting to MongoDB or fetching data:", error);
    res.status(500).send("Error fetching data");
  } finally {
    // Close the MongoDB client
    await client.close();
  }
});

// Start the server
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});
