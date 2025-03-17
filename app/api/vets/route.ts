import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();


export async function GET() {
    try {
        const vets = await prisma.veterinarian.findMany({
            orderBy: { vet_id: "asc" }
        });

        return new Response(JSON.stringify(vets), { status: 200 });
    } catch (error) {
        console.error("Error fetching vets:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch vets" }), { status: 500 });
    }
}
export async function POST(request: Request) {
    try {
      const { email, password, name, phone,  speciality } = await request.json();
  
      
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return new Response(
          JSON.stringify({ error: "Email already exists" }),
          { status: 400 }
        );
      }
  
     
      if (!email || !password || !name || !phone ||  !speciality) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          { status: 400 }
        );
      }
  
   
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: "VETERINARIAN", 
          veterinarian: {
            create: {
              name,
              phone,
              speciality,
            }
          }
        },
        include: { veterinarian: true } 
      });
  
      return new Response(
        JSON.stringify({ message: "Veterinarian registered successfully", user: newUser }),
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating vet:", error);
      return new Response(
        JSON.stringify({ error: "Failed to create vet" }),
        { status: 500 }
      );
    }
  }
