import { Telegraf } from 'telegraf';
import { BOT_TOKEN } from './config';
import { startCommand } from './commands/start';
import { createWalletCommand } from './commands/create-wallet';
import { balanceCommand } from './commands/balance';

const bot = new Telegraf(BOT_TOKEN);

// Реєструємо команди
bot.start(startCommand);
bot.command('balance', balanceCommand);


// Обробляємо кнопки
bot.action('create_wallet', createWalletCommand);
bot.action('check_balance', async (ctx) => {
    await ctx.reply('Будь ласка, введіть адресу гаманця у форматі: /balance <адреса>');
});

// Запускаємо бота
bot.launch();
console.log('Бот запущений!');
