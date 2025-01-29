import { Context } from 'telegraf';
import { Markup } from 'telegraf';

export const startCommand = async (ctx: Context) => {
    await ctx.reply(
        'Greetings! I am a bot for creating Solana wallets. Use the buttons below to take action:',
        Markup.inlineKeyboard([
            Markup.button.callback('Create Wallet', 'create_wallet'),
            Markup.button.callback('Check Balance', 'check_balance'),
            Markup.button.callback('Load Wallet', 'load_wallet'),
            Markup.button.callback('Send Solana', 'send_sol'),
            Markup.button.callback('Request Airdrop', 'load_airdrop'),
        ])
    );
};
