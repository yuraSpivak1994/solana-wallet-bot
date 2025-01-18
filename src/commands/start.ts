import { Context } from 'telegraf';
import { Markup } from 'telegraf';

export const startCommand = async (ctx: Context) => {
    await ctx.reply(
        'Привіт! Я бот для створення Solana гаманців. Використай кнопки нижче для виконання дій:',
        Markup.inlineKeyboard([
            Markup.button.callback('Створити гаманець', 'create_wallet'),
            Markup.button.callback('Перевірити баланс', 'check_balance'),
        ])
    );
};
