import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"; 
import { creditWalletService } from "@/services/wallet.service";


export async function POST(req: Request) {
    try {
        const token = (await cookies()).get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        const data = await req.json();
        const amount = data.amount;
        const reason = data.reason;
        const userId = (decoded as any).userId;
        const updatedWallet = await creditWalletService(userId, amount, reason);
        return NextResponse.json(
            {
                balance: updatedWallet.balance, 
                currency: updatedWallet.currency
            }, 
            { status: 200 }
        );
    } catch (error: any) {
        if (error.message === "Wallet not found") {
            return NextResponse.json(
                { 
                    error: "Unauthorized", 
                    message: error.message
                }, 
                { status: 401 }
            );
        }else{
            return NextResponse.json({ error: error.message }, { status: 500 });    
        }
    }
}
