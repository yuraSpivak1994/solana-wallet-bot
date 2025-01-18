import { Context } from 'telegraf';
import { getWalletBalance } from '../services/wallet.service';
import { Message } from '@telegraf/types';

export const balanceCommand = async (ctx: Context & { message: Message.TextMessage }) => {
    // Перевіряємо, чи є текст у повідомленні
    const message = ctx.message.text; // Тепер TypeScript знає, що це текст
    const address = message.split(' ')[1]; // Отримуємо адресу після команди /balance

    if (!address) {
        await ctx.reply('Будь ласка, введіть адресу гаманця. Наприклад: /balance <адреса>');
        return;
    }

    try {
        // Перевіряємо баланс
        const balance = await getWalletBalance(address);
        await ctx.reply(`Баланс гаманця ${address}: ${balance.toFixed(2)} SOL`);
    } catch (error) {
        await ctx.reply('Помилка при перевірці балансу. Перевірте, чи правильна адреса.');
    }
};
