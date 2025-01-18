import { Context } from 'telegraf';
import { getWalletBalance } from '../services/wallet.service';

export const balanceCommand = async (ctx: Context & { message?: { text?: string } }) => {
    const message = ctx.message?.text || '';
    const address = message.split(' ')[1];

    if (!address) {
        await ctx.reply('Будь ласка, введіть адресу гаманця у форматі: /balance <адреса>');
        return;
    }

    try {
        const balance = await getWalletBalance(address);
        await ctx.reply(`Баланс гаманця ${address}: ${balance.toFixed(2)} SOL`);
    } catch (error) {
        console.error('Помилка перевірки балансу:', error);
        await ctx.reply('Помилка при перевірці балансу. Перевірте, чи правильна адреса.');
    }
};
