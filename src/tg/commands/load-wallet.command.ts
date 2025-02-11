import { Context } from 'telegraf';
import { WalletService } from '../../services/wallet.service';

export class LoadWalletCommand {
    private walletService: WalletService;

    constructor() {
        this.walletService = new WalletService();
    }

    public async loadAllWallets(ctx: Context): Promise<{ publicKey: string; privateKey: string }[]> {
        const chatId: number | undefined = ctx.chat?.id;
        if (!chatId) {
            ctx.reply('Could not retrieve chat ID. Please try again.');
            return [];
        }

        const wallets: { publicKey: string; privateKey: string }[] =
            await this.walletService.getWallets(ctx.chat?.id.toString() || '');

        return wallets;
    }
}
