import { Telegraf } from 'telegraf';
import { BOT_TOKEN } from './config';
import { startCommand } from './commands/start';
import { createWalletCommand, loadWalletCommand } from './commands/create-wallet';
import { checkBalanceCommand, processCheckBalance } from './commands/balance';
import { requestAirdropCommand } from './commands/airdrop';

const bot = new Telegraf(BOT_TOKEN);

// Реєструємо команди
bot.start(startCommand);

// Обробляємо кнопки
bot.action('create_wallet', createWalletCommand);
bot.action('load_wallet', loadWalletCommand);
bot.action('check_balance', checkBalanceCommand);
bot.action('load_airdrop', requestAirdropCommand);



// Обробляємо текстові повідомлення для перевірки балансу
bot.on('text', processCheckBalance);



// Запускаємо бота
bot.launch();
console.log('Bot started!');
