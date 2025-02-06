import { Context } from 'telegraf';
import { KeyManagementService } from '../../services/key-management.service';

export class ShowWalletsCommand {
    private keyService: KeyManagementService;

    constructor(keyService: KeyManagementService) {
        this.keyService = keyService;
    }

    public async execute(ctx: Context): Promise<void> {
        try {
            const wallets = this.keyService.getAllWallets();

            if (!wallets.length) {
                await ctx.reply('No wallets found.');
                return;
            }

            let message = '🔑 Your saved wallets:\n\n';
            wallets.forEach((wallet, index) => {
                message += `<b>Wallet ${index + 1}:</b>\n<code>${wallet.publicKey}</code>\n\n`;
            });

            await ctx.reply(message, { parse_mode: 'HTML' });
        } catch (error) {
            console.error('Error fetching wallets:', error);
            await ctx.reply('Failed to fetch wallets. Please try again later.');
        }
    }
}
