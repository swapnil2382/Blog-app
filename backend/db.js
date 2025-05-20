const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/blogDB'; // Replace with your MongoDB URI
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
});
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db('blogDB');
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to database');
  }
}

function getDB() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

// Handle MongoDB connection errors
client.on('error', (err) => {
  console.error('MongoDB client error:', err);
});

module.exports = { connectDB, getDB };