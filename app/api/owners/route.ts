import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const owners = await prisma.owner.findMany({
            orderBy: { owner_id: "asc" }, 
            select: {
                owner_id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                gender: true,
                pets: {
                    select: { pet_code: true, name: true }
                }
            }
        });

        return new Response(JSON.stringify(owners), {
            headers: { "Content-Type": "application/json" },
            status: 200
        });

    } catch (error) {
        console.error("Error fetching owners:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch owners" }), {
            headers: { "Content-Type": "application/json" },
            status: 500
        });
    }
}


export async function POST(request: Request) {
    try {
        const { name, phone, email, address, gender } = await request.json();

        const newOwner = await prisma.owner.create({
            data: { name, phone, email, address, gender }
        });

        return new Response(JSON.stringify(newOwner), {
            headers: { "Content-Type": "application/json" },
            status: 201
        });

    } catch (error) {
        console.error("Error creating owner:", error);
        return new Response(JSON.stringify({ error: "Failed to create owner" }), {
            headers: { "Content-Type": "application/json" },
            status: 500
        });
    }
}
