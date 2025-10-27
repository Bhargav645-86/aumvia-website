import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  // During build time, use a placeholder
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
    console.warn('MONGODB_URI not set, using placeholder for build');
  } else {
    throw new Error('Please add your Mongo URI to .env.local');
  }
}

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/aumvia';
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;