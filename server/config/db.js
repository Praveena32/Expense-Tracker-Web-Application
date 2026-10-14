import mongoose from 'mongoose';

/**
 * Reusable MongoDB connection module
 * Connects to MongoDB via MONGO_URI from environment variables.
 * In development, if local mongod is not running, falls back to in-memory MongoDB
 * so the application is completely functional without manual database installation.
 */
export const connectDB = async () => {
  // Reuse existing connection if active (crucial for serverless environments like Vercel)
  if (mongoose.connection && mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const isCloudDeployment = Boolean(process.env.VERCEL || process.env.NODE_ENV === 'production');
  const uri = process.env.MONGO_URI;

  if (!uri && isCloudDeployment) {
    throw new Error('MONGO_URI environment variable is not defined in Vercel Project Settings.');
  }

  const targetUri = uri || 'mongodb://localhost:27017/expense_tracker';

  try {
    const conn = await mongoose.connect(targetUri, {
      serverSelectionTimeoutMS: isCloudDeployment ? 10000 : 2500,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    if (!isCloudDeployment) {
      console.warn(`[Database] Could not connect to primary MONGO_URI (${err.message}). Starting in-memory MongoDB for local development...`);
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const memoryUri = mongod.getUri();
        const conn = await mongoose.connect(memoryUri);
        console.log(`[Database] In-Memory MongoDB Connected successfully at: ${memoryUri}`);
        return conn;
      } catch (memErr) {
        console.error(`[Database] Failed to initialize in-memory fallback: ${memErr.message}`);
        throw memErr;
      }
    } else {
      console.error(`[Database] MongoDB connection error: ${err.message}`);
      throw err;
    }
  }
};

export default connectDB;
