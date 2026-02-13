import { debitWallet } from "@/services/wallet.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { userId, amount, reason } = body;

    if (!userId || !amount) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await debitWallet(userId, amount, reason);

    return Response.json(result, { status: 200 });
  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 400 }
    );
  }
}