import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(currentDirectory, '../../.env') });

mongoose.set('strictQuery', true);

const connectionCache = globalThis.__mongooseConnectionCache || {
    promise: null
};
globalThis.__mongooseConnectionCache = connectionCache;

export const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error('MONGODB_URI environment variable is missing');
    }

    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (!connectionCache.promise) {
        connectionCache.promise = mongoose.connect(mongoUri, {
            bufferCommands: false
        });
    }

    try {
        const db = await connectionCache.promise;
        console.log('MongoDB connected successfully');
        return db.connection;
    } catch (error) {
        connectionCache.promise = null;
        console.error('MongoDB connection error:', error.message);
        throw error;
    }
};

export default connectDB;