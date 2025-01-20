import { Connection, PublicKey } from '@solana/web3.js';

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Запит тестових токенів
const requestAirdrop = async (publicKey: string) => {
    try {
        const pubKey = new PublicKey(publicKey);
        console.log('Запитуємо airdrop...');
        const signature = await connection.requestAirdrop(pubKey, 1e9); // 1 SOL = 1e9 лампорт
        await connection.confirmTransaction(signature);
        console.log('Airdrop завершено!');
    } catch (error) {
        console.error('Помилка під час airdrop:', error);
    }
};

// Замінити публічний ключ на свій
requestAirdrop('Dy7HWPFRsHK3Np6Pk696itVTXA24fpN2pwofc2Afaa6P');
