import { MongoClient, ObjectId, Collection } from 'mongodb';
import dotenv from 'dotenv';
import { UserWalletData } from '../models/user.model';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI!;
const DB_NAME = 'cryptoBotDB';
const COLLECTION_NAME = 'wallets';

if (!MONGO_URI) {
    console.error('❌ MONGO_URI is not defined! Please check your .env file.');
    process.exit(1);
}

export class WalletStorageService {
    private client: MongoClient;

    constructor() {
        this.client = new MongoClient(MONGO_URI);
    }

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


    /**
     * Save a new wallet for a user
     */
    async saveWallet(chatId: string, publicKey: string, privateKeyBase64: string): Promise<void> {
        const collection = await this.connect();

        await collection.updateOne(
            { _id: chatId as unknown as ObjectId },
            {$push: { wallets: { publicKey, privateKey: privateKeyBase64 } }},
            { upsert: true }
        );
        console.log(`✅ Wallet saved to MongoDB for chatId: ${chatId}`);
    }

    /**
     * Get all wallets for a user
     */
    async getWallets(chatId: string): Promise<{ publicKey: string; privateKey: string }[]> {
        const collection = await this.connect();
        const userData = await collection.findOne<UserWalletData>({ _id: new ObjectId(chatId) });

        return userData?.wallets || [];
    }
}
