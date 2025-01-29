import { JsonStorageService } from './json-storage.service';

export class KeyManagementService {
    private storage: JsonStorageService;

    constructor() {
        this.storage = new JsonStorageService('keys.json');
    }

    public saveKey(publicKey: string, privateKey: string): void {
        this.storage.appendData({ publicKey, privateKey });
    }

    public getAllWallets(): { publicKey: string; privateKey: string }[] {
        try {
            const wallets = this.storage.readData<{ publicKey: string; privateKey: string }[]>();
            return Array.isArray(wallets) ? wallets : [];
        } catch (error) {
            console.error('Error retrieving wallets:', error);
            return [];
        }
    }

}
