

const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const databaseName = 'happy';
const client = new MongoClient(url);

async function getData() {
    try {
        // Connect to the database
        const result = await client.connect();
        const db = result.db(databaseName);
        const collection = db.collection('task-manager');

        // Fetch and log existing data
        let data = await collection.find({}).toArray();
        console.log('Data before insertion:', data);

        // Insert a new document
        await collection.insertOne({
            name: 'miko',
            age: 21
        });

        console.log('Document inserted successfully');

        // Fetch and log data after insertion
        data = await collection.find({}).toArray();
        console.log('Data after insertion:', data);
    } finally {
        // Close the connection in the finally block to ensure it's closed regardless of success or failure
        await client.close();
    }
}

getData().catch(error => console.error('Error:', error));
