import { Keypair } from '@solana/web3.js';

// Функція для створення нового гаманця
export const createWallet = () => {
    const wallet = Keypair.generate(); // Генеруємо пару ключів
    const publicKey = wallet.publicKey.toBase58();
    const privateKey = Buffer.from(wallet.secretKey).toString('base64');
    return { publicKey, privateKey };
};
