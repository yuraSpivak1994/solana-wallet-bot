import { JsonStorageService } from './json-storage.service';

export class KeyManagementService {
    private storage: JsonStorageService;

    constructor() {
        this.storage = new JsonStorageService('keys.json');
    }

    public saveKey(userId: number, publicKey: string, privateKey: string): void {
        this.storage.appendData({ publicKey, privateKey });
    }

    public getKey(userId: number): { publicKey: string; privateKey: string } | null {
        const keys = this.storage.readData<Record<number, { publicKey: string; privateKey: string }>>();
        return keys[userId] || null;
    }
}
