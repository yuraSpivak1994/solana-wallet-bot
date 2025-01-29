import {
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction,
} from '@solana/web3.js';

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

            // Отримуємо актуальний blockhash
            const { blockhash } = await this.connection.getLatestBlockhash('finalized');

            const transaction = new Transaction({
                recentBlockhash: blockhash,
                feePayer: fromKeypair.publicKey,
            }).add(
                SystemProgram.transfer({
                    fromPubkey: fromKeypair.publicKey,
                    toPubkey: toKey,
                    lamports: amount * 1e9, // Конвертуємо SOL -> лампорти
                })
            );

            // Підписуємо транзакцію
            transaction.sign(fromKeypair);

            // Відправляємо та чекаємо підтвердження транзакції
            const signature = await sendAndConfirmTransaction(this.connection, transaction, [fromKeypair], {
                commitment: 'finalized',
            });

            return signature;
        } catch (error) {
            console.error('Error sending Solana:', error);
            throw new Error('Failed to send Solana. Please try again.');
        }
    }
}
