import { Telegraf } from 'telegraf';
import { BOT_TOKEN } from './config';
import { startCommand } from './commands/start';
import { createWalletCommand, loadWalletCommand } from './commands/create-wallet';
import { balanceCommand, checkBalanceCommand } from './commands/balance';
import { PublicKey } from '@solana/web3.js';
import { getWalletBalance } from './services/wallet.service';

const bot = new Telegraf(BOT_TOKEN);
const userState: Record<number, { waitingForAddress?: boolean }> = {};

// Реєструємо команди
bot.start(startCommand);

// Обробляємо кнопки
bot.action('create_wallet', createWalletCommand);
bot.action('load_wallet', loadWalletCommand);
bot.action('check_balance', async (ctx) => {
    const chatId = ctx.chat?.id;

    if (chatId) {
        // Встановлюємо стан для чату: очікування введення адреси
        userState[chatId] = { waitingForAddress: true };

        await ctx.reply('Please enter the wallet address to check the balance:');
    } else {
        await ctx.reply('Could not retrieve chat ID. Please try again.');
    }
});



// Обробляємо текстові повідомлення для перевірки балансу
bot.on('text', async (ctx) => {
    const chatId = ctx.chat?.id;

    if (chatId && userState[chatId]?.waitingForAddress) {
        // Скидаємо стан очікування
        userState[chatId].waitingForAddress = false;

        try {
            const publicKey = ctx.message.text.trim(); // Отримуємо введену адресу
            const balance = await getWalletBalance(publicKey); // Викликаємо функцію для перевірки балансу

            await ctx.reply(`The balance of wallet ${publicKey} is: ${balance.toFixed(2)} SOL`);
        } catch (error) {
            console.error('Error checking wallet balance:', error);
            await ctx.reply('Invalid wallet address or an error occurred. Please try again.');
        }
    }
});



// Запускаємо бота
bot.launch();
console.log('Bot started!');
