import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

// Use the URL constructor to get the current file path
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Uploading the environment variables
dotenv.config({ path: path.resolve(__dirname, '../env/.env') });

const clientOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbname: 'Knowledge-Learning',
};

const clientDbInitConnection = async () => {
    try {
        const mongoUri = process.env.URL_MONGO;
        if (!mongoUri) {
            throw new Error('Mongo URI is undefined. Please check your .env file.');
        }
        await mongoose.connect(mongoUri, clientOptions);
        console.log('Connected to MongoDB');
    } catch (e) {
        console.log('Error connecting to MongoDB:', e);
        throw e;
    }
};

export default clientDbInitConnection;
