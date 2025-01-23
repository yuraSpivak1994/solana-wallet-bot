import { Connection, PublicKey } from '@solana/web3.js';
import { Context } from 'telegraf';
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Функція для обробки airdrop
export const requestAirdropCommand = async (ctx: Context): Promise<void> => {
    try {
        const publicKey = process.env.PUBLIC_KEY; // Використовуємо PUBLIC_KEY із .env
        if (!publicKey) {
            await ctx.reply('Public key not found. Please load a wallet first.');
            return;
        }

        const pubKey = new PublicKey(publicKey);
        await ctx.reply('Requesting airdrop...');
        const signature = await connection.requestAirdrop(pubKey, 1e9); // 1 SOL = 1e9 лампорт
        await connection.confirmTransaction(signature);

        await ctx.reply('Airdrop successful! Check your wallet balance.');
        console.log('Airdrop success!');
    } catch (error) {
        console.error('Error during airdrop:', error);
        await ctx.reply('Airdrop failed. Please try again later.');
    }
};
