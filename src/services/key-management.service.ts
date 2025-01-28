import { JsonStorageService } from './json-storage.service';

export class KeyManagementService {
    private storage: JsonStorageService;

    constructor() {
        this.storage = new JsonStorageService('keys.json');
    }

    public saveKey(publicKey: string, privateKey: string): void {
        this.storage.appendData({ publicKey, privateKey });
    }

    public getWallet(chatId: number): { publicKey: string; privateKey: string } | null {
        try {
            // Зчитуємо всі дані
            const wallets = this.storage.readData<Record<number, { publicKey: string; privateKey: string }>>();
            console.log(wallets);
            // Перевіряємо, чи є гаманець для вказаного chatId
            if (!wallets[chatId]) {
                console.log(`Wallet not found for chatId: ${chatId}`);
                return null;
            }

            // Повертаємо гаманець користувача
            return wallets[chatId];
        } catch (error) {
            console.error('Error retrieving wallet:', error);
            return null;
        }
    }
}
