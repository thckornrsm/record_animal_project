import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { user_id: "asc" }, 
            select: {
                user_id: true,
                email: true,
                role: true,
                createdAt: true,
                owner: {
                    select: { owner_id: true, name: true, email: true, phone: true }
                },
                veterinarian: {
                    select: { vet_id: true, name: true,  phone: true }
                }
            }
        });

        return new Response(JSON.stringify(users), {
            headers: { "Content-Type": "application/json" },
            status: 200
        });

    } catch (error) {
        console.error("Error fetching users:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch users" }), {
            headers: { "Content-Type": "application/json" },
            status: 500
        });
    }
}


export async function POST(request: Request) {
    try {
        const { email, password, role } = await request.json();

        const newUser = await prisma.user.create({
            data: {
                email,
                password, 
                role
            }
        });

        return new Response(JSON.stringify(newUser), {
            headers: { "Content-Type": "application/json" },
            status: 201
        });

    } catch (error) {
        console.error("Error creating user:", error);
        return new Response(JSON.stringify({ error: "Failed to create user" }), {
            headers: { "Content-Type": "application/json" },
            status: 500
        });
    }
}
