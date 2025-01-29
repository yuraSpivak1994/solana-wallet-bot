import { Connection, PublicKey } from '@solana/web3.js';
import { Context } from 'telegraf';

export class AirdropCommand {
    private connection: Connection;

    constructor() {
        this.connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    }

    public async requestAirdrop(ctx: Context): Promise<void> {
        try {
            const publicKey = process.env.PUBLIC_KEY;
            if (!publicKey) {
                await ctx.reply('Public key not found. Please load a wallet first.');
                return;
            }

            const pubKey = new PublicKey(publicKey);
            await ctx.reply('Requesting airdrop...');
            const signature = await this.connection.requestAirdrop(pubKey, 5 * 1e9); // 5 SOL у лампортах
            await this.connection.confirmTransaction(signature, 'finalized');

            await ctx.reply('✅ Airdrop successful! Check your wallet balance.');
            console.log('Airdrop success!');
        } catch (error) {
            console.error('❌ Error during airdrop:', error);
            await ctx.reply('Airdrop failed. Please try again later.');
        }
    }
}
