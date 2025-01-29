import { Telegraf } from 'telegraf';
import { BOT_TOKEN } from './config';
import { startCommand } from './commands/start';
import { AirdropCommand } from './commands/airdrop';
import { loadWalletCommand } from './commands/load-wallet';
import { KeyManagementService } from './services/key-management.service';
import { CreateWalletCommand } from './commands/create-wallet';
import { SendSolanaCommand } from './commands/send-sol.command';
import { UserStateService } from './services/user-state.service';
import { BalanceCommand } from './commands/balance';

const bot = new Telegraf(BOT_TOKEN);

// Ініціалізуємо сервіси
const keyService = new KeyManagementService();
const createWalletCommand = new CreateWalletCommand(keyService);
const sendSolanaCommand = new SendSolanaCommand();
const userStateService = new UserStateService();
const balanceCommand = new BalanceCommand(userStateService);
const airdropCommand = new AirdropCommand();


// Реєструємо команди
bot.start(startCommand);

// Обробляємо кнопки
bot.action('create_wallet', async (ctx) => createWalletCommand.execute(ctx));
bot.action('load_wallet', loadWalletCommand);
bot.action('check_balance', async (ctx) => balanceCommand.requestBalance(ctx));
bot.action('load_airdrop', async (ctx) => airdropCommand.requestAirdrop(ctx));

// Додаємо обробку кнопки
bot.action('send_sol', (ctx) => sendSolanaCommand.executeAction(ctx));

bot.on('text', async (ctx) => {
    const chatId = ctx.chat?.id;

    if (userStateService.getState(chatId)?.waitingForKey) {
        await balanceCommand.processCheckBalance(ctx);
    } else {
        await sendSolanaCommand.handleText(ctx);
    }
});



// Запускаємо бота
bot.launch();
console.log('Bot started!');
