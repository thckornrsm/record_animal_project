import { PrismaClient } from "@prisma/client";
import { getSession } from "@/app/lib/auth";


const prisma = new PrismaClient();



export async function GET(request: Request) {
    try {
        const records = await prisma.medical_Record.findMany({
            include: {
                pet: { select: { name: true, species: true } },
                veterinarian: { select: { name: true } }, 
            },
            orderBy: { appointmentDate: "desc" },
        });

        return new Response(JSON.stringify(records), { status: 200 });
    } catch (error) {
        console.error("❌ Error fetching medical records:", error);
        return new Response(JSON.stringify({ error: "❌ Failed to fetch medical records" }), { status: 500 });
    }
}



export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { pet_id, diagnosis, treatment, appointmentDate, vet_id } = body;

     
        if (!pet_id || !diagnosis || !treatment || !vet_id) {
            return new Response(
                JSON.stringify({ error: "❌ Missing required fields: pet_id, diagnosis, treatment, vet_id" }),
                { status: 400 }
            );
        }

        const newRecord = await prisma.medical_Record.create({
            data: {
                petId: pet_id,
                vetId: vet_id,
                diagnosis,
                treatment,
                appointmentDate: appointmentDate ? new Date(appointmentDate) : null,
            },
        });
        
        await prisma.pet.update({
            where: { pet_id: pet_id },
            data: { vetId: vet_id }, 
        });

        return new Response(
            JSON.stringify({ message: "✅ Medical record created", record: newRecord }),
            { status: 201 }
        );
    } catch (error) {
        console.error("❌ Error creating medical record:", error);
        return new Response(
            JSON.stringify({ error: "❌ Failed to create medical record." }),
            { status: 500 }
        );
    }
}






