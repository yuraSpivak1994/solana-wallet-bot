import { Collection, MongoClient } from 'mongodb';
import { COLLECTION_NAME, DB_NAME } from '../constants/route.constant';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI!;


if (!MONGO_URI) {
    console.error('❌ MONGO_URI is not defined! Please check your .env file.');
    process.exit(1);
}

export class ConnectService {
    private client = new MongoClient(MONGO_URI);

    async connect(): Promise<Collection<Document>> {
        try {
            await this.client.connect();
            await this.client.db().command({ ping: 1 });
            console.log('✅ Successfully connected to MongoDB');
        } catch (error) {
            console.error('❌ MongoDB connection error:', error);
            process.exit(1);
        }
        return this.client.db(DB_NAME).collection(COLLECTION_NAME);
    }
}