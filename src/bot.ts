import { Telegraf } from 'telegraf';
import { BOT_TOKEN } from './config';
import { startCommand } from './commands/start';
import { checkBalanceCommand, processCheckBalance } from './commands/balance';
import { requestAirdropCommand } from './commands/airdrop';
import { loadWalletCommand } from './commands/load-wallet';
import { KeyManagementService } from './services/key-management.service';
import { CreateWalletCommand } from './commands/create-wallet';

const bot = new Telegraf(BOT_TOKEN);

// Ініціалізуємо сервіси
const keyService = new KeyManagementService();
const createWalletCommand = new CreateWalletCommand(keyService);

// Реєструємо команди
bot.start(startCommand);

// Обробляємо кнопки
bot.action('create_wallet', async (ctx) => createWalletCommand.execute(ctx));
bot.action('load_wallet', loadWalletCommand);
bot.action('check_balance', checkBalanceCommand);
bot.action('load_airdrop', requestAirdropCommand);



// Обробляємо текстові повідомлення для перевірки балансу
bot.on('text', processCheckBalance);



// Запускаємо бота
bot.launch();
console.log('Bot started!');
