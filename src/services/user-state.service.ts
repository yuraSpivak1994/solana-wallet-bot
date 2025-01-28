interface UserState {
    waitingForKey?: boolean;
    waitingForAmount?: boolean;
    recipientKey?: string;
}

export class UserStateService {
    private userStates: Record<number, UserState> = {};

    public setState(chatId: number, state: Partial<UserState>): void {
        if (!this.userStates[chatId]) {
            this.userStates[chatId] = {};
        }
        this.userStates[chatId] = { ...this.userStates[chatId], ...state };
    }

    public getState(chatId: number): UserState | undefined {
        return this.userStates[chatId];
    }

    public clearState(chatId: number): void {
        delete this.userStates[chatId];
    }
}
