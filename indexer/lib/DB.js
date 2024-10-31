const { MongoClient } = require("mongodb");

async function connectToDB() {
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    return client.db("smart_contract_index");
}

module.exports = { connectToDB }