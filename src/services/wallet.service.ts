import { Collection, ObjectId } from 'mongodb';
import { UserWalletData } from '../models/user.model';
import { ConnectService } from './connect.service';


export class WalletService {
    private connectService: ConnectService;

    constructor() {
        this.connectService = new ConnectService();
    }
    /**
     * Save a new wallet for a user
     */
    async saveWallet(chatId: string, publicKey: string, privateKeyBase64: string): Promise<void> {
        const collection = await this.connectService.connect();


        await collection.updateOne(
            { _id: chatId as unknown as ObjectId },
            {$push: { wallets: { publicKey, privateKey: privateKeyBase64 } }},
            { upsert: true }
        ).catch((error) => {
            console.error('Error saving wallet to MongoDB:', error);
        })
        console.log(`✅ Wallet saved to MongoDB for chatId: ${chatId}`);
    }

    /**
     * Get all wallets for a user
     */
    async getWallets(chatId: string): Promise<{ publicKey: string; privateKey: string }[]> {
        const collection: Collection<Document> = await this.connectService.connect();
        console.log(chatId);
        const userData: UserWalletData | null = await collection.findOne<UserWalletData>({ _id: chatId as unknown as ObjectId});

        return userData?.wallets || [];
    }
}
