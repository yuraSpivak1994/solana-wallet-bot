import { Context } from 'telegraf';

export const startCommand = async (ctx: Context) => {
    await ctx.reply('Привіт! Я бот для створення Solana гаманців. Використай команду /create_wallet для створення нового гаманця.');
};
