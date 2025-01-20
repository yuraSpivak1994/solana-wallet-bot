import { getWalletBalance } from '../services/wallet.service';

// Публічний ключ одержувача
const recipientPublicKey = 'Dy7HWPFRsHK3Np6Pk696itVTXA24fpN2pwofc2Afaa6P';

(async () => {
    try {
        console.log('--- Перевірка балансу ---');
        const balance = await getWalletBalance(recipientPublicKey);
        console.log(`Баланс одержувача (${recipientPublicKey}): ${balance} SOL`);
    } catch (error) {
        console.error('Помилка під час перевірки балансу:', error);
    }
})();
