import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const ownerId = Number(params.id);

        if (isNaN(ownerId)) {
            return new Response(JSON.stringify({ error: "Invalid owner ID" }), { status: 400 });
        }
        const owner = await prisma.owner.findUnique({
            where: { owner_id: ownerId }
        });
        if (!owner) {
            return new Response(JSON.stringify({ error: "Owner not found" }), { status: 404 });
        }
        return new Response(JSON.stringify(owner), { status: 200 });

    } catch (error) {
        console.error("Error fetching owner:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch owner" }), { status: 500 });
    }
}


export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const ownerId = Number(params.id);

        if (isNaN(ownerId)) {
            return new Response(JSON.stringify({ error: "Invalid owner ID" }), { status: 400 });
        }

        const { name, phone, email, address, gender } = await request.json();

        const updatedOwner = await prisma.owner.update({
            where: { owner_id: ownerId },
            data: { name, phone, email, address, gender }
        });

        return new Response(JSON.stringify(updatedOwner), { status: 200 });

    } catch (error) {
        console.error("Error updating owner:", error);
        return new Response(JSON.stringify({ error: "Failed to update owner" }), { status: 500 });
    }
}


export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const ownerId = Number(params.id);

        if (isNaN(ownerId)) {
            return new Response(JSON.stringify({ error: "Invalid owner ID" }), { status: 400 });
        }

        const deletedOwner = await prisma.owner.delete({
            where: { owner_id: ownerId }
        });

        return new Response(JSON.stringify({ message: "Owner deleted successfully", deletedOwner }), { status: 200 });

    } catch (error) {
        console.error("Error deleting owner:", error);
        return new Response(JSON.stringify({ error: "Failed to delete owner" }), { status: 500 });
    }
}
