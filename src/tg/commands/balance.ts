import { Context } from 'telegraf';
import { getWalletBalance } from '../../services/wallet.service';
import { UserStateService } from '../../services/user-state.service';
//@ts-ignore
import bs58 from 'bs58';

export class BalanceCommand {
    private userStateService: UserStateService;

    constructor(userStateService: UserStateService) {
        this.userStateService = userStateService;
    }

    public async requestBalance(ctx: Context): Promise<void> {
        const chatId = ctx.chat?.id;
        if (!chatId) {
            await ctx.reply('Could not retrieve chat ID. Please try again.');
            return;
        }

        // Set user state to waiting for address
        this.userStateService.setState(chatId, { waitingForKey: true });

        await ctx.reply('Please enter the wallet address to check the balance:');
    }

    public async processCheckBalance(ctx: Context & { message?: { text?: string } }): Promise<void> {
        const chatId = ctx.chat?.id;
        const text = ctx.message?.text?.trim();

        if (!chatId || !text) {
            await ctx.reply('Invalid request. Please enter a valid wallet address.');
            return;
        }

        if (text.length !== 44 || !bs58.decode(text)) {
            await ctx.reply('Invalid wallet address format. Please try again.');
            return;
        }

        // Check user state
        const userState = this.userStateService.getState(chatId);
        if (userState?.waitingForKey) {
            try {
                // Remove waiting state
                this.userStateService.clearState(chatId);

                // Get wallet balance
                const balance = await getWalletBalance(text);
                await ctx.reply(
                    `Balance of wallet (\n<code>${text}</code>\n): ${balance} SOL`,
                    { parse_mode: 'HTML' }
                );
            } catch (error) {
                console.error('Error checking balance:', error);
                await ctx.reply('Could not retrieve the balance. Please check the wallet address and try again.');
            }
        } else {
            await ctx.reply('Please use the buttons to interact with the bot.');
        }
    }
}
