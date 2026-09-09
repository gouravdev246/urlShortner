import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(currentDirectory, '../../.env') });

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is missing from server/.env');
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        throw error;
    }
};
export default connectDB;