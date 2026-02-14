import { NextResponse } from "next/server"; 
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"; 
import { debitWalletService } from "@/services/wallet.service";

// API: POST /wallet/debit
// Body:
// {
//   amount: 2000,
//   reason: "BUY_ORDER"
// }

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
        const updatedWallet = await debitWalletService(userId, amount, reason);
        return NextResponse.json(
            {
                balance: updatedWallet.balance, 
                currency: updatedWallet.currency
            }, 
            { status: 200 }
        );
    } catch (error: any) {
        if (error.message === "Wallet not found" || error.message === "Insufficient funds") {
            return NextResponse.json(
                { 
                    error: "Unauthorized", 
                    message: error.message
                }, 
                { status: 401 }
            );
        } else {
            return NextResponse.json({ error: error.message }, { status: 500 });    
        }
    }
}