import { Telegraf } from 'telegraf';
import { BOT_TOKEN } from './config';
import { startCommand } from './commands/start';
import { createWalletCommand, loadWalletCommand } from './commands/create-wallet';
import { balanceCommand } from './commands/balance';

const bot = new Telegraf(BOT_TOKEN);

// Реєструємо команди
bot.start(startCommand);
bot.command('balance', balanceCommand);


// Обробляємо кнопки
bot.action('create_wallet', createWalletCommand);
bot.action('check_balance', async (ctx) => {
    await ctx.reply('Please enter the wallet address in the format: /balance <adress>');
});

bot.action('load_wallet', loadWalletCommand);

// Запускаємо бота
bot.launch();
console.log('Bot started!');
