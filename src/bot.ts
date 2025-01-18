import { Telegraf } from 'telegraf';
import { BOT_TOKEN } from './config';
import { startCommand } from './commands/start';
import { createWalletCommand } from './commands/create-wallet';

const bot = new Telegraf(BOT_TOKEN);

// Реєструємо команди
bot.start(startCommand);
bot.command('create_wallet', createWalletCommand);

// Запускаємо бота
bot.launch();
console.log('Бот запущений!');
