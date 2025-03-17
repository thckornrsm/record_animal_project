import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const vetId = Number(params.id);

        if (isNaN(vetId)) {
            return new Response(JSON.stringify({ error: "Invalid vet ID" }), { status: 400 });
        }

        const vet = await prisma.veterinarian.findUnique({
            where: { vet_id: vetId }
        });

        if (!vet) {
            return new Response(JSON.stringify({ error: "Vet not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(vet), { status: 200 });

    } catch (error) {
        console.error("Error fetching vet:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch vet" }), { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const vetId = Number(params.id);

        if (isNaN(vetId)) {
            return new Response(JSON.stringify({ error: "Invalid vet ID" }), { status: 400 });
        }

        const { name,  phone, speciality } = await request.json();

        const updatedVet = await prisma.veterinarian.update({
            where: { vet_id: vetId },
            data: { name, phone, speciality }
        });

        return new Response(JSON.stringify(updatedVet), { status: 200 });

    } catch (error) {
        console.error("Error updating vet:", error);
        return new Response(JSON.stringify({ error: "Failed to update vet" }), { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const vetId = Number(params.id);

        if (isNaN(vetId)) {
            return new Response(JSON.stringify({ error: "Invalid vet ID" }), { status: 400 });
        }

        const deletedVet = await prisma.veterinarian.delete({
            where: { vet_id: vetId }
        });

        return new Response(JSON.stringify({ message: "Vet deleted successfully", deletedVet }), { status: 200 });

    } catch (error) {
        console.error("Error deleting vet:", error);
        return new Response(JSON.stringify({ error: "Failed to delete vet" }), { status: 500 });
    }
}
