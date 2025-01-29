import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js';
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

// Функція для створення нового гаманця
export const createWallet = () => {
    const wallet = Keypair.generate(); // Генеруємо пару ключів
    const publicKey = wallet.publicKey.toBase58();
    const privateKey = Buffer.from(wallet.secretKey).toString('base64');
    return { publicKey, privateKey };
};

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
