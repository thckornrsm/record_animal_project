import { PrismaClient } from "@prisma/client";
import { verify } from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY || "mysecretkey"; 

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get("Authorization");
        console.log("🔹 Received Authorization Header:", authHeader); 

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const token = authHeader.split(" ")[1];

        let decoded;
        try {
            
            decoded = verify(token, SECRET_KEY);
            console.log("✅ Decoded Token:", decoded); 
        } catch (error) {
            console.error("🚨 Token Verification Failed:", error);
            return new Response(JSON.stringify({ error: "Invalid or Expired Token" }), { status: 403 });
        }

      
        if (!decoded || typeof decoded !== "object" || !decoded.userId) {
            console.error("🚨 Invalid Token Structure");
            return new Response(JSON.stringify({ error: "Invalid token structure" }), { status: 403 });
        }

        
        const user = await prisma.user.findUnique({
            where: { user_id: decoded.userId }, 
            select: { user_id: true, email: true, role: true, createdAt: true, ownerId: true, vetId: true }
        });

        if (!user) {
            console.error("🚨 User Not Found");
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

       
        return new Response(JSON.stringify({ user }), { status: 200 });

    } catch (error) {
        console.error("🚨 API Error:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch user data" }), { status: 500 });
    }
}
