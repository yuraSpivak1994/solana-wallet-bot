import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js';
import { WalletService } from './wallet.service';
import { prepareKeyToMongoDB } from '../utils/key-encoding';
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

// Функція для створення нового гаманця
const walletStorageService = new WalletService();

export async function createWallet(chatId: number): Promise<{ publicKey: string; privateKey: string }> {
    // Генеруємо новий ключ Solana
    const keypair = Keypair.generate();
    const publicKey = keypair.publicKey.toBase58();
    const privateKeyEncoded = prepareKeyToMongoDB(keypair.secretKey);

    // Зберігаємо у MongoDB
    await walletStorageService.saveWallet(chatId.toString(), publicKey, privateKeyEncoded);

    console.log('✅ New Solana Wallet Created & Stored');
    return { publicKey, privateKey: privateKeyEncoded };
}

export const getWalletBalance = async (publicKey: string): Promise<number> => {
    try {
        const walletPublicKey = new PublicKey(publicKey);
        const balance = await connection.getBalance(walletPublicKey); // Баланс у лампортах
        return balance
    } catch (error) {
        console.error('Error getting wallet balance:', error);
        throw new Error('Could not get wallet balance. Please check the wallet address.');
    }
};


// Завантаження гаманця з environment
export const loadWalletFromEnv = (): Keypair => {
    const publicKey = process.env.PUBLIC_KEY;
    const privateKey = process.env.PRIVATE_KEY;

    if (!publicKey || !privateKey) {
        throw new Error('Public or private key not found in environment variables');
    }
    const wallet: Keypair = Keypair.fromSecretKey(Buffer.from(privateKey, 'base64'));

    return wallet;
};
