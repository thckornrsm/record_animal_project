import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { email, password, role, name, phone, address, gender } = await request.json();

       
        const userRole = role || "OWNER";

        
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return new Response(JSON.stringify({ error: "Email already exists" }), { status: 400 });
        }

     
        const hashedPassword = await bcrypt.hash(password, 10);

        let newUser;
        if (userRole === "OWNER") {
           
            const existingOwner = await prisma.owner.findUnique({ where: { name } });
            if (existingOwner) {
                return new Response(JSON.stringify({ error: "Owner name already exists" }), { status: 400 });
            }

            newUser = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role: userRole,
                    owner: {
                        create: {
                            name,
                            phone,
                            email,
                            address,
                            gender,
                        }
                    }
                },
                include: { owner: true }
            });

        } else if (userRole === "VETERINARIAN") {
            
            return new Response(JSON.stringify({ error: "Only Admin can register Veterinarian" }), { status: 400 });
        } else {
            return new Response(JSON.stringify({ error: "Invalid role" }), { status: 400 });
        }

        return new Response(JSON.stringify({ message: "User registered successfully", user: newUser }), { status: 201 });

    } catch (error) {
        console.error("Registration Error:", error);
        return new Response(JSON.stringify({ error: "Failed to register user" }), { status: 500 });
    }
}
