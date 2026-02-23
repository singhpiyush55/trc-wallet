import prisma from '../lib/prisma';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export async function transferFunds(request: NextRequest, key: string, coins: number) {
    // Find the receiver by key
    const receiver = await prisma.user.findUnique({
        where: { key },
    });
    if (!receiver) {
        throw new Error('Receiver not found');
    }

    const receiverWallet = await prisma.wallet.findUnique({
        where: { userId: receiver.id },
    });

    // Sender details
    const token = request.cookies.get("token")?.value;
    if (!token) {
        throw new Error('Token not found');
    }
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const sender = await prisma.user.findUnique({
        where: { id: decoded.userId },
    });
    

    // Wallet details of the sender.
    const senderWallet = await prisma.wallet.findUnique({
        where: { userId: sender!.id },
    });

    // Check if sender has enough coins
    if (senderWallet!.balance < coins) {
        throw new Error('Insufficient balance');
    }

    // Update sender's wallet balance
    const updatedSenderWallet = await prisma.wallet.update({
        where: { userId: sender!.id },
        data: { balance: senderWallet!.balance - coins },
    });

    // Update receiver's wallet balance
    await prisma.wallet.update({
        where: { userId: receiver.id },
        data: { balance: (receiverWallet?.balance || 0) + coins },
    });

    return { 
        success: true, 
        message: 'Transfer successful',
        balance: updatedSenderWallet.balance
    };
}