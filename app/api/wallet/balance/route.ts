import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getWalletBalanceService } from "@/services/wallet.service";

export async function GET() {
    try{
        const token = (await cookies()).get("token")?.value;
        const decoded = jwt.verify(token!, process.env.JWT_SECRET!);
        const userId = (decoded as any).userId;

        // Fetch wallet balance by userId
        const wallet = await getWalletBalanceService(userId);
        return NextResponse.json(
            {
                balance: wallet?.balance, 
                currency: wallet?.currency
            }, 
            {status: 200}
        );
    } catch (error) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
}