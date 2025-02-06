import { Connection, Keypair, PublicKey, SystemProgram, Transaction, clusterApiUrl } from '@solana/web3.js';

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

/**
 * Відправка SOL між гаманцями
 * @param fromPrivateKey Приватний ключ відправника (в base64)
 * @param toPublicKey Публічний ключ одержувача
 * @param amount Сума SOL для відправки
 * @returns Підпис транзакції
 */
export const sendSol = async (fromPrivateKey: string, toPublicKey: string, amount: number): Promise<string> => {
    try {
        // Відновлення гаманця відправника
        const fromWallet = Keypair.fromSecretKey(Buffer.from(fromPrivateKey, 'base64'));
        const toWallet = new PublicKey(toPublicKey);

        // Перевірка балансу відправника
        const senderBalance = await connection.getBalance(fromWallet.publicKey);
        if (senderBalance < amount * 1e9) {
            throw new Error('Недостатньо коштів для виконання транзакції.');
        }

        // Створення транзакції
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: fromWallet.publicKey,
                toPubkey: toWallet,
                lamports: amount * 1e9, // Переводимо SOL у лампорти
            })
        );

        // Підпис і відправка транзакції
        const signature = await connection.sendTransaction(transaction, [fromWallet]);
        await connection.confirmTransaction(signature);

        return signature; // Повертаємо підпис транзакції
    } catch (error) {
        const errorMessage = error as any;
        throw new Error(`Помилка під час відправки SOL: ${errorMessage.message as any}`);
    }
};
