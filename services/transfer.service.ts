import prisma from "../lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export async function transferFunds(request: NextRequest, key: string, coins: number) {
    if (!Number.isFinite(coins) || coins <= 0) {
        throw new Error("Transfer amount must be greater than zero");
    }

    const receiver = await prisma.user.findUnique({
        where: { key },
    });
    if (!receiver) {
        throw new Error("Receiver not found");
    }

    const token = request.cookies.get("token")?.value;
    if (!token) {
        throw new Error("Token not found");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    if (decoded.userId === receiver.id) {
        throw new Error("Cannot transfer to your own account");
    }

    const sender = await prisma.user.findUnique({
        where: { id: decoded.userId },
    });
    if (!sender) {
        throw new Error("Sender not found");
    }

    const senderWallet = await prisma.wallet.findUnique({
        where: { userId: sender.id },
    });
    if (!senderWallet) {
        throw new Error("Sender wallet not found");
    }

    const receiverWallet = await prisma.wallet.findUnique({
        where: { userId: receiver.id },
    });
    if (!receiverWallet) {
        throw new Error("Receiver wallet not found");
    }

    if (senderWallet.balance < coins) {
        throw new Error("Insufficient balance");
    }

    const [updatedSenderWallet] = await prisma.$transaction([
        prisma.wallet.update({
            where: { userId: sender.id },
            data: { balance: senderWallet.balance - coins },
        }),
        prisma.wallet.update({
            where: { userId: receiver.id },
            data: { balance: receiverWallet.balance + coins },
        }),
        prisma.walletTransaction.create({
            data: {
                walletId: senderWallet.id,
                type: "DEBIT",
                amount: coins,
                balanceAfter: senderWallet.balance - coins,
                reason: `Transfer to ${receiver.key}`,
            },
        }),
        prisma.walletTransaction.create({
            data: {
                walletId: receiverWallet.id,
                type: "CREDIT",
                amount: coins,
                balanceAfter: receiverWallet.balance + coins,
                reason: `Transfer from ${sender.key}`,
            },
        }),
    ]);

    return {
        success: true,
        message: "Transfer successful",
        balance: updatedSenderWallet.balance,
    };
}