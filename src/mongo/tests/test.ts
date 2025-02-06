import { Keypair } from '@solana/web3.js';

const wallet = Keypair.generate();
console.log('Public Key:', wallet.publicKey.toBase58());
console.log('Private Key:', Buffer.from(wallet.secretKey).toString('base64'));
