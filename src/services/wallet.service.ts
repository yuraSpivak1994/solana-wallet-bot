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
        return balance / 1e9; // Переводимо баланс у SOL
    } catch (error) {
        console.error('Помилка перевірки балансу:', error);
        throw new Error('Неможливо отримати баланс. Перевірте адресу гаманця.');
    }
};
