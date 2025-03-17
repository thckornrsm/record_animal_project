import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const userId = Number(params.id);

        if (isNaN(userId)) {
            return new Response(JSON.stringify({ error: "Invalid user ID" }), { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { user_id: userId },
            include: {
                owner: { select: { owner_id: true, name: true, email: true } },
                veterinarian: { select: { vet_id: true, name: true,  } }
            }
        });

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(user), { status: 200 });

    } catch (error) {
        console.error("Error fetching user:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch user" }), { status: 500 });
    }
}


export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const userId = Number(params.id);

        if (isNaN(userId)) {
            return new Response(JSON.stringify({ error: "Invalid user ID" }), { status: 400 });
        }

        const { email, password, role } = await request.json();

        const updatedUser = await prisma.user.update({
            where: { user_id: userId },
            data: { email, password, role }
        });

        return new Response(JSON.stringify(updatedUser), { status: 200 });

    } catch (error) {
        console.error("Error updating user:", error);
        return new Response(JSON.stringify({ error: "Failed to update user" }), { status: 500 });
    }
}


export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const userId = Number(params.id);

        if (isNaN(userId)) {
            return new Response(JSON.stringify({ error: "Invalid user ID" }), { status: 400 });
        }

        const deletedUser = await prisma.user.delete({
            where: { user_id: userId }
        });

        return new Response(JSON.stringify({ message: "User deleted successfully", deletedUser }), { status: 200 });

    } catch (error) {
        console.error("Error deleting user:", error);
        return new Response(JSON.stringify({ error: "Failed to delete user" }), { status: 500 });
    }
}
