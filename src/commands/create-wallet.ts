import { Context } from 'telegraf';
import { createWallet, loadWalletFromEnv } from '../services/wallet.service'; // Сервіс для створення гаманця
import fs from 'fs';

export const createWalletCommand = async (ctx: Context): Promise<void> => {
    try {
        const { publicKey, privateKey } = createWallet();

        // Зберігаємо ключі в .env
        const envContent = `PUBLIC_KEY=${publicKey}\nPRIVATE_KEY=${privateKey}\n`;
        fs.writeFileSync('.env', envContent);

        await ctx.reply(`your wallet has been created!\n\n<b>Public address:</b>\n<code>${publicKey}</code>\n\n<b>Private key:</b>\n<code>${privateKey}</code>`, {
            parse_mode: 'HTML',
        });
    } catch (error) {
        console.error('Error creating wallet:', error);
        await ctx.reply('An error occurred while creating the wallet, try later.');
    }
};

export const loadWalletCommand = async (ctx: Context): Promise<void> => {
    try {
        // Використовуємо функцію для завантаження гаманця
        const wallet = loadWalletFromEnv();

        const publicKey = wallet.publicKey;

        await ctx.reply(
            `Your wallet has been loaded!\n\n<b>Public address:</b> \n<code>${publicKey}</code>\n`,
            { parse_mode: 'HTML' }
        );
    } catch (error) {
        console.error('Error loading wallet:', error);
        await ctx.reply('An error occurred while loading the wallet. Make sure it is saved.');
    }
};
