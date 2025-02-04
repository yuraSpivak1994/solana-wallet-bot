import bs58 from 'bs58';

/**
 * Кодує приватний ключ у base58 перед збереженням у базі даних.
 * @param privateKey Uint8Array - Приватний ключ у вигляді масиву байтів.
 * @returns string - Ключ у форматі base58.
 */
export function prepareKeyToMongoDB(privateKey: Uint8Array): string {
    return bs58.encode(privateKey);
}

/**
 * Декодує приватний ключ з base58 перед використанням у додатку.
 * @param encodedKey string - Приватний ключ у форматі base58.
 * @returns Uint8Array - Декодований ключ у вигляді масиву байтів.
 */
export function decodeKeyFromMongoDB(encodedKey: string): Uint8Array {
    return bs58.decode(encodedKey);
}
