import { prepareKeyToMongoDB, decodeKeyFromMongoDB } from '../../utils/key-encoding';
import bs58 from 'bs58';

function testKeyEncoding() {
    // Генеруємо випадковий масив байтів для тесту (імітація приватного ключа)
    const privateKey = new Uint8Array([128, 64, 32, 16, 8, 4, 2, 1, 255, 200]);

    console.log('Original Private Key:', privateKey);

    // Кодуємо ключ у base58
    const encodedKey = prepareKeyToMongoDB(privateKey);
    console.log('Encoded Key:', encodedKey);

    // Декодуємо назад у Uint8Array
    const decodedKey = decodeKeyFromMongoDB(encodedKey);
    console.log('Decoded Key:', decodedKey);

    // Перевіряємо чи оригінальний та декодований ключі однакові
    const isValid = JSON.stringify(Array.from(privateKey)) === JSON.stringify(Array.from(decodedKey));

    console.log(isValid ? '✅ Encoding/Decoding works correctly!' : '❌ Encoding/Decoding failed!');
}

// Запускаємо тест
testKeyEncoding();
