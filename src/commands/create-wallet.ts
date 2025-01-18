import { Context } from 'telegraf';
import { createWallet } from '../services/wallet.service';

export const createWalletCommand = async (ctx: Context) => {
    const { publicKey, privateKey } = createWallet();
    await ctx.reply(`Ваш новий гаманець створено!\n\n<b>Публічна адреса:</b>\n<code>${publicKey}</code>\n\n<b>Приватний ключ:</b>\n<code>${privateKey}</code>`, {
        parse_mode: 'HTML',
    });
};

// Функція для перевірки балансу гаманця
