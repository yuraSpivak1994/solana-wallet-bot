import { Context } from 'telegraf';
import { createWallet } from '../services/wallet.service'; // Сервіс для створення гаманця
import { KeyManagementService } from '../services/key-management.service';

export class CreateWalletCommand {
    private keyService: KeyManagementService;

    constructor(keyService: KeyManagementService) {
        this.keyService = keyService;
    }

    public async  execute(ctx: Context): Promise<void> {
        try {
            const chatId = ctx.chat?.id;
            if (!chatId) {
                await ctx.reply('Could not retrieve chat ID. Please try again.');
                return;
            }

            const { publicKey, privateKey } = createWallet();
            await ctx.reply(
                `Wallet successfully created!\n<b>Public Key:</b> \n<code>${publicKey}</code>\n<b>Private Key:</b> \n<code>${privateKey}</code>\n`,
                { parse_mode: 'HTML' }
            );

            this.keyService.saveKey( publicKey, privateKey);


        } catch (error) {
            console.error('Error creating wallet:', error);
            await ctx.reply('An error occurred while creating the wallet. Please try again.');
        }
    }
}
