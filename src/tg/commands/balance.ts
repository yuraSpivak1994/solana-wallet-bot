import { Context } from 'telegraf';
import { getWalletBalance } from '../../services/wallet-test.service';
import { UserStateService } from '../../services/user-state.service';
//@ts-ignore
import bs58 from 'bs58';
import { Keypair } from '@solana/web3.js';
import { decodeKeyFromMongoDB, prepareKeyToMongoDB } from '../../utils/key-encoding';

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
            await ctx.reply('Invalid request. Please enter a valid private key.');
            return;
        }
        console.log(text);

        let keypair;
        try {
            // Decode private key and create Keypair
            const privateKeyBytes = bs58.decode(text);
            keypair = Keypair.fromSecretKey(privateKeyBytes);
        } catch (error) {
            await ctx.reply('Invalid private key format. Please try again.');
            return;
        }

        // Check user state
        const userState = this.userStateService.getState(chatId);
        if (userState?.waitingForKey) {
            try {
                // Remove waiting state
                this.userStateService.clearState(chatId);

                // Get wallet balance using private key
                const balance = await getWalletBalance(keypair.publicKey.toBase58());
                await ctx.reply(
                    `Balance of wallet (Private Key)
            <code>${prepareKeyToMongoDB(keypair.secretKey)}</code>: ${balance} SOL`,
                    { parse_mode: 'HTML' }
                );
            } catch (error) {
                console.error('Error checking balance:', error);
                await ctx.reply('Could not retrieve the balance. Please check the private key and try again.');
            }
        } else {
            await ctx.reply('Please use the buttons to interact with the bot.');
        }
    }


}
