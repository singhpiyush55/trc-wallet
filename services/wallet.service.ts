import prisma from "@/lib/prisma";

export async function getWalletBalanceService(userId: string) {
    // 1. Fetch wallet by userId
    try{
        const wallet = await prisma.wallet.findUnique({
            where: { userId },
        });
    return wallet;
    } catch (error) {
        throw error;
    }
}

export async function creditWalletService(
    userId: string, 
    amount: number, 
    reason: string
) {
    try {
        // 1. Fetch wallet by userId
        const wallet = await prisma.wallet.findUnique({
            where: { userId },
        });
        if (!wallet) {
            throw new Error("Wallet not found");
        }
        // 2. Update wallet balance
        const updatedWallet = await prisma.wallet.update({
            where: { userId },
            data: {
                balance: wallet.balance + amount,
            },
        });
        // 3. Create transaction record
        await prisma.walletTransaction.create({
            data: {
                walletId: wallet.id,
                type: "CREDIT",
                amount,
                balanceAfter: updatedWallet.balance,
                reason,
            },
        });
        return updatedWallet;
    } catch (error) {
        throw error;
    }
}

export async function debitWalletService(
    userId: string, 
    amount: number,
    reason: string
) {
    try {
        // 1. Fetch wallet by userId
        const wallet = await prisma.wallet.findUnique({
            where: { userId },
        });
        if (!wallet) {
            throw new Error("Wallet not found");
        }
        if(wallet.balance < amount){
            throw new Error("Insufficient funds");
        }
        // 2. Update wallet balance
        const updatedWallet = await prisma.wallet.update({
            where: { userId },
            data: {
                balance: wallet.balance - amount,
            },
        });
        // 3. Create transaction record
        await prisma.walletTransaction.create({
            data: {
                walletId: wallet.id,
                type: "DEBIT",
                amount,
                balanceAfter: updatedWallet.balance,
                reason,
            },
        });
        return updatedWallet;
    } catch (error) {
        throw error;
    }
}