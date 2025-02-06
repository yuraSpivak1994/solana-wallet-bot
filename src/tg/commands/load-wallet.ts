import { Context } from 'telegraf';
import { loadWalletFromEnv } from '../../services/wallet.service';

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
