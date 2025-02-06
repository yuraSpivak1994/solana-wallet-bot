export interface UserState {
    waitingForKey: boolean;
    waitingForAmount: boolean;
    recipientKey: string;
}

export interface UserWalletData {
    _id: string;
    wallets: { publicKey: string; privateKey: string }[];
}