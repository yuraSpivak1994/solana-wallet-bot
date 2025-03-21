import { Context } from 'telegraf';
import { createWallet } from '../../services/wallet-test.service'; // Сервіс для створення гаманця
import { KeyManagementService } from '../../services/key-management.service';
import { WalletService } from '../../services/wallet.service';

export class CreateWalletCommand {
    private keyService: KeyManagementService;
    private walletService = new WalletService();

    constructor() {
        this.keyService = new KeyManagementService();
        this.walletService = new WalletService();
    }

    public async  execute(ctx: Context): Promise<void> {
        try {
            const chatId: number | undefined = ctx.chat?.id;
            if (!chatId) {
                await ctx.reply('Could not retrieve chat ID. Please try again.');
                return;
            }

            const { publicKey, privateKey } = await createWallet(chatId);
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
