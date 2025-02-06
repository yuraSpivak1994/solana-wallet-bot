import { Context } from 'telegraf';
import { TransactionService } from '../../services/transaction.service';
import { UserStateService } from '../../services/user-state.service';

export class SendSolanaCommand {
    private transactionService: TransactionService;
    private userState: UserStateService;

    constructor() {
        this.transactionService = new TransactionService();
        this.userState = new UserStateService();
    }

    public async executeAction(ctx: Context): Promise<void> {
        const chatId = ctx.chat?.id;
        if (!chatId) {
            await ctx.reply('Could not retrieve chat ID. Please try again.');
            return;
        }

        // Встановлюємо стан користувача на очікування введення адреси
        this.userState.setState(chatId, { waitingForKey: true });

        await ctx.reply('Please enter the public key of the recipient wallet:');
    }

    public async handleText(ctx: Context & { message?: { text?: string } }): Promise<void> {
        const chatId = ctx.chat?.id;
        const text = ctx.message?.text?.trim();

        if (!chatId || !text) {
            await ctx.reply('Could not process your message. Please try again.');
            return;
        }

        const user = this.userState.getState(chatId);

        if (user?.waitingForKey) {
            // Зберігаємо ключ отримувача і переходимо до очікування суми
            this.userState.setState(chatId, {
                recipientKey: text,
                waitingForKey: false,
                waitingForAmount: true
            });

            await ctx.reply('Please enter the amount of Solana to send:');
            return;
        }

        if (user?.waitingForAmount) {
            const amount = parseFloat(text);
            if (isNaN(amount) || amount <= 0) {
                await ctx.reply('Invalid amount. Please enter a valid number.');
                return;
            }

            try {
                await ctx.reply('sending...');
                // Відправляємо SOL
                const signature = await this.transactionService.sendSol(
                    process.env.PRIVATE_KEY!,
                    user.recipientKey!,
                    amount
                );

                await ctx.reply(`Transaction successful! Signature: ${signature}`);
            } catch (error) {
                console.error('Error sending Solana:', error);
                await ctx.reply('Failed to send Solana. Please try again.');
            }

            // Очищаємо стан користувача
            this.userState.clearState(chatId);
            return;
        }

        // Якщо користувач не в стані очікування
        await ctx.reply('Please use the buttons to interact with the bot.');
    }
}
