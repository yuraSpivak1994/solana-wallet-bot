import { Context } from 'telegraf';
import { getWalletBalance } from '../services/wallet.service';
//@ts-ignore
import bs58 from 'bs58';

// User state to track if they are waiting for a wallet address
const userState: Record<number, { waitingForAddress?: boolean }> = {};

// Function to handle balance check initiation
export const checkBalanceCommand = async (ctx: Context): Promise<void> => {
    const chatId: number = ctx.chat?.id as number;
    if (typeof chatId === 'number') {
        // Встановлюємо стан для чату: очікування введення адреси
        userState[chatId] = { waitingForAddress: true };

        await ctx.reply('Please enter the wallet address to check the balance:');
    } else {
        await ctx.reply('Could not retrieve chat ID. Please try again.');
    }
}

// Function to handle the actual balance check
export const processCheckBalance = async (ctx: Context & { message?: { text?: string } }): Promise<void> => {
    const chatId: number = ctx.chat?.id as number;
    const text = ctx.message?.text?.trim();

    if (!text || text.length !== 44 || !bs58.decode(text)) {
        await ctx.reply('Invalid wallet address format. Please try again.');
        return;
    }

    // Check if the user is waiting for an address
    const user = userState[chatId];
    if (user?.waitingForAddress) {
        try {
            // Remove the waiting state
            userState[chatId].waitingForAddress = false;

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
        // If the user is not in "waiting for address" state
        await ctx.reply('Please use the buttons to interact with the bot.');
    }
};

