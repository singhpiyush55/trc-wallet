import { userSignin } from "@/services/user.service";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request){
    try{
        const data = await req.json();
        const email = data.email;
        const password = data.password;
        if(!email || !password){
            return NextResponse.json({error: "Missing fields"}, {status: 400});
        }   
        
        const token = await userSignin(email, password);
        (await cookies()).set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
        });
        return NextResponse.json({token}, {status: 200});
    } catch (error: any) {
        if(error.message === "User not found" || error.message === "Invalid credentials"){
            return NextResponse.json({error: error.message}, {status: 401});
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}