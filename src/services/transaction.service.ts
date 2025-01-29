import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { confirmTransactions } from '../utils/transaction-utils';

export class TransactionService {
    private connection: Connection;

    constructor() {
        this.connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    }

    public async sendSol(
        fromPrivateKey: string,
        toPublicKey: string,
        amount: number
    ): Promise<string> {
        try {
            const fromKeypair = Keypair.fromSecretKey(Buffer.from(fromPrivateKey, 'base64'));
            const toKey = new PublicKey(toPublicKey);

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: fromKeypair.publicKey,
                    toPubkey: toKey,
                    lamports: amount * 1e9,
                })
            );

            const signature = await this.connection.sendTransaction(transaction, [fromKeypair]);

            // Використовуємо утилітку для підтвердження транзакції
            await confirmTransactions(this.connection, [signature]);

            return signature;
        } catch (error) {
            console.error('❌ Error sending Solana:', error);
            throw new Error('Failed to send Solana. Please try again.');
        }
    }
}
