import { NextResponse } from "next/server";
import { createUser } from "@/services/user.service";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const user = await createUser(name, email, password);

        return NextResponse.json({ user }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}