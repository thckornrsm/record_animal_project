import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY || "mysecretkey"; 

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        const user = await prisma.user.findUnique({
            where: { email },
            include: { owner: true, veterinarian: true }, 
        });

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
        }

       
        const name = user.owner?.name || user.veterinarian?.name || user.email;

      
        const token = jwt.sign({ userId: user.user_id }, SECRET_KEY, { expiresIn: "1h" });

        return new Response(JSON.stringify({ token, user: { ...user, name } }), { status: 200 });
    } catch (error) {
        console.error("Login Error:", error);
        return new Response(JSON.stringify({ error: "Failed to login" }), { status: 500 });
    }
}
