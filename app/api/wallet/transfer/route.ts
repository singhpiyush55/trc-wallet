/*
{
    "Key" : "",
    "coins" : __
}
*/

// Get the token form the cookie.
// Find the user who sent the request using the token.
// Chekk if he have enough coins to transfer.
// If he have enough coins, transfer the coins to the key's account.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { transferFunds } from "@/services/transfer.service";


export async function POST(request: NextRequest) {
    const { key, coins } = await request.json();
    try {
        const result = await transferFunds(request, key, coins);
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}