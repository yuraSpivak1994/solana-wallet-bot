import { Context } from 'telegraf';
import { sendSol } from '../services/wallet.service';
import { Message } from '@telegraf/types';

export const sendSolCommand = async (ctx: Context & { message: Message.TextMessage }) => {
    const message = ctx.message?.text || '';
    const parts = message.split(' '); // Розділяємо повідомлення на частини
    const toPublicKey = parts[1];
    const amount = parseFloat(parts[2]);

    if (!toPublicKey || isNaN(amount)) {
        await ctx.reply('Невірний формат. Використовуйте команду так: /send <адреса_отримувача> <сума>');
        return;
    }

    try {
        // Замінити на реальний приватний ключ відправника
        const fromPrivateKey = '<ВСТАВИТИ_ПРИВАТНИЙ_КЛЮЧ_ВІДПРАВНИКА>';
        const signature = await sendSol(fromPrivateKey, toPublicKey, amount);
        await ctx.reply(`Успішно відправлено ${amount} SOL на адресу ${toPublicKey}.\nID транзакції: ${signature}`);
    } catch (error) {
        await ctx.reply('Сталася помилка під час відправки SOL. Перевірте введені дані та спробуйте знову.');
    }
};
