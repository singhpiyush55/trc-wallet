import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUser = async (email: string, pass: string) => {
    // 1. Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    if (existingUser) {
      throw new Error("User already exists");
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(pass, 12);

    // As this is a fin service, all should be wrapped in a transaction to ensure atomicity
    await prisma.$transaction(async (prisma) => {
        // 3. Create User
        const user = await prisma.user.create({
            data: {
            email,
            password: hashedPassword,
            },
        });

        // 4. Create an wallet for the user with default balance.
        const wallet = await prisma.wallet.create({
            data: {
            userId: user.id,
            currency: "TRC", 
            },
        });

        // 5. Add transaction history entry for wallet creation
        const transaction = await prisma.walletTransaction.create({
            data: {
            walletId: wallet.id, 
            type: "CREDIT",
            amount: 100000,
            balanceAfter: 100000,
            reason: "Initial wallet creation",
            },
        });

        console.log(user, wallet, transaction);
        return user;
    });
};

export const userSignin = async (email: string, pass: string) => {
    // 1. Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error("User not found");
    }

    // 2. Compare password    
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    // 3. Sign a jwt and return it. 
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
    return token;
}