import { Context } from 'telegraf';
import { LoadWalletCommand } from './load-wallet.command';

export class ShowWalletsCommand {
    private loadWalletCommand: LoadWalletCommand;

    constructor() {
        this.loadWalletCommand = new LoadWalletCommand();
    }

    public async showWallets(ctx: Context): Promise<void> {
        console.log(ctx);
        try {
            const wallets = await this.loadWalletCommand.loadAllWallets(ctx);

            if (!wallets.length) {
                await ctx.reply('No wallets found.');
                return;
            }

            let message = '🔑 Your saved wallets:\n\n';
            wallets.forEach((wallet, index) => {
                message += `<b>Wallet ${index + 1}:</b>\n<code>${wallet.privateKey}</code>\n\n`;
            });

            await ctx.reply(message, { parse_mode: 'HTML' });
        } catch (error) {
            console.error('Error fetching wallets:', error);
            await ctx.reply('Failed to fetch wallets. Please try again later.');
        }
    }
}
