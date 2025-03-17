import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const recordId = Number(params.id);
        
        if (isNaN(recordId)) {
            return new Response(JSON.stringify({ error: "❌ Invalid record ID" }), { status: 400 });
        }

        const record = await prisma.medical_Record.findUnique({
            where: { record_id: recordId },
            include: {
                pet: { select: { name: true, species: true } },
                veterinarian: { select: { name: true, speciality: true } }
            }
        });

        if (!record) {
            return new Response(JSON.stringify({ error: "❌ Record not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(record), { status: 200 });

    } catch (error) {
        console.error("❌ Error fetching record:", error);
        return new Response(JSON.stringify({ error: "❌ Failed to fetch record" }), { status: 500 });
    }
}



export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const recordId = Number(params.id);
        if (isNaN(recordId)) {
            return new Response(JSON.stringify({ error: "❌ Invalid record ID" }), { status: 400 });
        }
        const { vetId, diagnosis, treatment, appointmentDate } = await request.json();
        
        if (!vetId) {
            return new Response(JSON.stringify({ error: "❌ Missing vetId" }), { status: 400 });
        }
       
        const existingRecord = await prisma.medical_Record.findUnique({ where: { record_id: recordId } });
        if (!existingRecord) {
            return new Response(JSON.stringify({ error: "❌ Record not found" }), { status: 404 });
        }

        if (existingRecord.vetId !== vetId) {
            return new Response(JSON.stringify({ error: "❌ Permission denied: You can only edit your own records" }), { status: 403 });
        }
        
        const updatedRecord = await prisma.medical_Record.update({
            where: { record_id: recordId },
            data: { diagnosis, treatment, appointmentDate },
        });

        return new Response(JSON.stringify({ message: "✅ Record updated successfully", updatedRecord }), { status: 200 });

    } catch (error) {
        console.error("❌ Error updating record:", error);
        return new Response(JSON.stringify({ error: "❌ Failed to update record" }), { status: 500 });
    }
}


export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const recordId = Number(params.id);
        if (isNaN(recordId)) {
            return new Response(JSON.stringify({ error: "❌ Invalid record ID" }), { status: 400 });
        }

        const { vetId } = await request.json();

        if (!vetId) {
            return new Response(JSON.stringify({ error: "❌ Missing vetId" }), { status: 400 });
        }

      
        const existingRecord = await prisma.medical_Record.findUnique({ where: { record_id: recordId } });
        if (!existingRecord) {
            return new Response(JSON.stringify({ error: "❌ Record not found" }), { status: 404 });
        }

        if (existingRecord.vetId !== vetId) {
            return new Response(JSON.stringify({ error: "❌ Permission denied: You can only delete your own records" }), { status: 403 });
        }


        await prisma.medical_Record.delete({ where: { record_id: recordId } });

        return new Response(JSON.stringify({ message: "✅ Record deleted successfully" }), { status: 200 });

    } catch (error) {
        console.error("❌ Error deleting record:", error);
        return new Response(JSON.stringify({ error: "❌ Failed to delete record" }), { status: 500 });
    }
}
