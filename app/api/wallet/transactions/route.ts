import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getWalletTransactionsService } from "@/services/wallet.service";

export async function GET() {
    try {
        const token = (await cookies()).get("token")?.value;    
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = (decoded as any).userId;
        const transactions = await getWalletTransactionsService(userId);
        console.table(transactions);
        return NextResponse.json({ transactions }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }   
}