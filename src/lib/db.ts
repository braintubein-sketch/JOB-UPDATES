import mongoose from 'mongoose';

const MONGODB_URI = (process.env.MONGODB_URI || '').trim();

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
  const MONGODB_URI = (process.env.MONGODB_URI || '').trim();

  if (!MONGODB_URI) {
    throw new Error(
      'MongoDB URI not configured. Please set MONGODB_URI in your .env file.'
    );
  }

  // Debug log (masked for security)
  const maskedUri = MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//****:****@');
  console.log(`[DB] Connecting to: ${maskedUri}`);

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
