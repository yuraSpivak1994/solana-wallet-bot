import { Keypair } from '@solana/web3.js';
import { prepareKeyToMongoDB, decodeKeyFromMongoDB } from '../../src/utils/key-encoding';
const { MongoClient } = require('mongodb');
import dotenv from 'dotenv';
dotenv.config();
console.log(process.env);
const MONGO_URI = process.env.MONGO_URI;

const DB_NAME = 'cryptoBotDB';
const COLLECTION_NAME = 'wallets';

async function testSolanaWallet() {
    try {
        if (!MONGO_URI) {
            console.error('❌ MONGO_URI is not defined! Please check your .env file.');
            process.exit(1);
        }
        // 1. Створюємо новий Solana Keypair (гаманець)
        const keypair = Keypair.generate();
        const publicKey = keypair.publicKey.toBase58();
        const privateKeyEncoded = prepareKeyToMongoDB(keypair.secretKey);

        console.log('Generated Solana Wallet:');
        console.log('Public Key:', publicKey);
        console.log('Encoded Private Key (Base58):', privateKeyEncoded);

        // 2. Підключаємось до MongoDB
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db(DB_NAME);
        const walletsCollection = db.collection(COLLECTION_NAME);

        // 3. Зберігаємо гаманець у базі даних
        const result = await walletsCollection.insertOne({
            publicKey,
            privateKey: privateKeyEncoded
        });
        console.log('✅ Wallet saved to MongoDB:', result.insertedId);

        // 4. Читаємо гаманець назад
        const savedWallet = await walletsCollection.findOne({ publicKey });
        if (!savedWallet) {
            console.error('❌ Wallet not found in MongoDB!');
            return;
        }

        console.log('Retrieved Wallet from MongoDB:', savedWallet);

        // 5. Декодуємо приватний ключ назад
        const decodedPrivateKey = decodeKeyFromMongoDB(savedWallet.privateKey);
        console.log('Decoded Private Key:', decodedPrivateKey);

        // 6. Перевіряємо, чи оригінальний і відновлений ключі однакові
        const isValid = JSON.stringify(Array.from(keypair.secretKey)) === JSON.stringify(Array.from(decodedPrivateKey));
        console.log(isValid ? '✅ Private Key restored correctly!' : '❌ Private Key mismatch!');

        // Закриваємо підключення до бази
        await client.close();
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

// Запускаємо тест
testSolanaWallet();
