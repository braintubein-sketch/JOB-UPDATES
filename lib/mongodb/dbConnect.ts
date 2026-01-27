import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI && process.env.NODE_ENV === 'production' && !process.env.NEXT_PHASE) {
    console.warn('MONGODB_URI is not defined');
}

let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        if (!MONGODB_URI) {
            throw new Error('Please define the MONGODB_URI environment variable inside .env');
        }
        const opts = {
            bufferCommands: false,
            // These options ensure better connectivity in serverless environments
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((m: any) => {
            return m;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;
