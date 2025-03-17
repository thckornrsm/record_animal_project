import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { vetId: string } }) {
    try {
        const vetId = Number(params.vetId);

        if (isNaN(vetId)) {
            return new Response(JSON.stringify({ error: "Invalid vet ID" }), { status: 400 });
        }

        const records = await prisma.medical_Record.findMany({
            where: { vetId },
            orderBy: { date: "desc" },
            include: {
                pet: { select: { pet_code: true, name: true, species: true } }
            }
        });

        return new Response(JSON.stringify(records), { status: 200 });

    } catch (error) {
        console.error("Error fetching records:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch records" }), { status: 500 });
    }
}
