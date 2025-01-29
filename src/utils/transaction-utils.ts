import { Connection } from '@solana/web3.js';

/**
 * Waits for the confirmation of multiple transactions.
 * @param connection Solana connection instance
 * @param signatures Array of transaction signatures
 * @param commitment Level of confirmation ('processed', 'confirmed', 'finalized')
 */
export const confirmTransactions = async (
    connection: Connection,
    signatures: string[],
    commitment: 'processed' | 'confirmed' | 'finalized' = 'confirmed'
): Promise<void> => {
    console.log(`🔍 Waiting for ${signatures.length} transactions to be confirmed...`);

    for (const signature of signatures) {
        try {
            const confirmation = await connection.confirmTransaction(signature, commitment);
            console.log(`✅ Transaction ${signature} confirmed with status:`, confirmation);
        } catch (error) {
            console.error(`❌ Error confirming transaction ${signature}:`, error);
        }
    }
};
