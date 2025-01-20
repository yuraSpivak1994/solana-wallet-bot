import { Keypair } from '@solana/web3.js';
import { getWalletBalance } from '../services/wallet.service';
import { sendSol } from '../commands/send-sol';

// Приватний ключ відправника у форматі Base64
const privateKeyBase64 = 'Ejx//j0UU0tE5ntNgQvxuHwDP4EH+3rkV95tYCDhSW/Aq9/bWBURQ4fLZkqyZs2rq5AY7lIQfDfjSIjco5WsxA==';
// Публічний ключ одержувача
const recipientPublicKey = 'Dy7HWPFRsHK3Np6Pk696itVTXA24fpN2pwofc2Afaa6P';
// Сума для відправлення у SOL
const transferAmount = 0.01;

(async () => {
    try {
        // Розшифровка приватного ключа
        const decodedKey = Buffer.from(privateKeyBase64, 'base64');
        console.log(`Довжина приватного ключа: ${decodedKey.length}`);

        if (decodedKey.length !== 64) {
            throw new Error('Неправильна довжина приватного ключа. Перевірте формат Base64.');
        }

        // Створення об'єкта Keypair з приватного ключа
        const senderWallet = Keypair.fromSecretKey(decodedKey);
        const senderPublicKey = senderWallet.publicKey.toBase58();
        console.log(`Публічний ключ відправника: ${senderPublicKey}`);

        // Перевірка балансу відправника
        const senderBalance = await getWalletBalance(senderPublicKey);
        console.log(`Баланс відправника: ${senderBalance} SOL`);

        if (senderBalance < transferAmount) {
            console.log('Недостатньо коштів для виконання транзакції.');
            return;
        }

        // Виконання транзакції
        const transactionSignature = await sendSol(privateKeyBase64, recipientPublicKey, transferAmount);
        console.log(`Транзакція успішно виконана. Signature: ${transactionSignature}`);
    } catch (error) {
        console.error('Сталася помилка:', error);
    }
})();
