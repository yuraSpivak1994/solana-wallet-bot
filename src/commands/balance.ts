import { Context } from 'telegraf';
import { getWalletBalance } from '../services/wallet.service';

export const balanceCommand = async (ctx: Context & { message?: { text?: string } }): Promise<void> => {
    try {
        const message = ctx.message?.text?.trim(); // Отримуємо введений текст (публічний ключ)

        if (!message) {
            await ctx.reply('Please provide a valid wallet public key to check the balance.');
            return;
        }

        const balance = await getWalletBalance(message); // Використовуємо сервіс для отримання балансу
        await ctx.reply(`Wallet balance for ${message}: ${balance.toFixed(2)} SOL`);
    } catch (error) {
        console.error('Error checking balance:', error);
        await ctx.reply('An error occurred while checking the balance. Please ensure the wallet address is correct.');
    }
};

export const checkBalanceCommand = async (ctx: Context): Promise<void> => {
    try {
        // Просимо користувача ввести адресу
        await ctx.reply('Please enter the wallet address to check the balance:');
        ctx.state.waitingForBalance = true; // Вказуємо, що бот очікує введення адреси
    } catch (error) {
        console.error('Error prompting for wallet address:', error);
        await ctx.reply('An error occurred while processing your request. Please try again later.');
    }
};

