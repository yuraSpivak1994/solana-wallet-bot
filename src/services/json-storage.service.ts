import * as fs from 'fs';
import * as path from 'path';

export class JsonStorageService {
    private filePath: string;

    constructor(fileName: string) {
        this.filePath = path.resolve(__dirname, `../storage/${fileName}`);
        this.ensureFileExists();
    }

    private ensureFileExists(): void {
        const dirPath = path.dirname(this.filePath);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, JSON.stringify({}));
        }
    }

    public readData<T>(): T {
        try {
            const data = fs.readFileSync(this.filePath, 'utf8');
            return JSON.parse(data) as T;
        } catch (error) {
            console.error('Error reading data from JSON file:', error);
            throw new Error('Failed to read JSON data');
        }
    }

    public appendData<T>(value: T): void {
        try {
            // Читаємо існуючі дані
            let existingData: T[];

            try {
                existingData = this.readData<T[]>();
                // Перевіряємо, чи це масив
                if (!Array.isArray(existingData)) {
                    throw new Error('JSON structure is invalid. Expected an array.');
                }
            } catch {
                // Якщо файл не існує або порожній, створюємо новий масив
                console.log('Initializing empty data.');
                existingData = [];
            }

            // Додаємо новий запис
            existingData.push(value);

            // Записуємо назад в файл
            fs.writeFileSync(this.filePath, JSON.stringify(existingData, null, 2));
        } catch (error) {
            console.error('Error appending data to JSON file:', error);
            throw new Error('Failed to append JSON data');
        }
    }





}
