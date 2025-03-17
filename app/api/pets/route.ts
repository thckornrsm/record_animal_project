import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    const name = body.get("name");
    const species = body.get("species");
    const breed = body.get("breed");
    const age = body.get("age");
    const weight = body.get("weight");
    const ownerId = body.get("ownerId");
    const gender = body.get("gender");
    const image = body.get("image") as File;

    
    if (!name || !species || !breed || !age || !weight || !ownerId || !gender || !image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const petCount = await prisma.pet.count();
    const pet_code = `P-${String(petCount + 1).padStart(6, "0")}`;

    
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${image.name}`;
    const filePath = path.join(uploadDir, filename);

    
    fs.writeFileSync(filePath, buffer);
    console.log("✅ Image saved at:", filePath);

    
    const newPet = await prisma.pet.create({
      data: {
        pet_code,
        name: String(name),
        species: String(species),
        breed: String(breed),
        age: Number(age),
        weight: Number(weight),
        gender: String(gender),
        ownerId: Number(ownerId),
        image: `/uploads/${filename}`, 
      },
    });

    return NextResponse.json({ message: "Pet added successfully!", pet: newPet }, { status: 201 });
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json({ error: "Failed to add pet" }, { status: 500 });
  }
}



export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const vetId = searchParams.get("vetId");
    const ownerId = searchParams.get("ownerId");

    let pets;

    if (vetId) {
      
      pets = await prisma.pet.findMany({
        where: {
          medicalRecords: { some: { vetId: Number(vetId) } },
        },
        select: {
          pet_id: true,
          pet_code: true,
          name: true,
          species: true,
          breed: true,
          age: true,
          weight: true,
          gender: true,
          image: true,
          owner: {
            select: {
              owner_id: true,
              name: true,
              email: true,
              phone: true,
              address: true,
            },
          },
          medicalRecords: {
            select: {
              record_id: true,
              diagnosis: true,
              treatment: true,
              appointmentDate: true,
              vetId: true,
            },
          },
        },
      });
    } else if (ownerId) {
  
      pets = await prisma.pet.findMany({
        where: {
          ownerId: Number(ownerId),
        },
        select: {
          pet_id: true,
          pet_code: true,
          name: true,
          species: true,
          breed: true,
          age: true,
          weight: true,
          gender: true,
          image: true,
          owner: {
            select: {
              owner_id: true,
              name: true,
              email: true,
              phone: true,
              address: true,
            },
          },
          medicalRecords: {
            select: {
              record_id: true,
              diagnosis: true,
              treatment: true,
              appointmentDate: true,
              vetId: true,
            },
          },
        },
      });
    } else {
   
      pets = await prisma.pet.findMany({
        select: {
          pet_id: true,
          pet_code: true,
          name: true,
          species: true,
          breed: true,
          age: true,
          weight: true,
          gender: true,
          image: true,
          owner: {
            select: {
              owner_id: true,
              name: true,
              email: true,
              phone: true,
              address: true,
            },
          },
          medicalRecords: {
            select: {
              record_id: true,
              diagnosis: true,
              treatment: true,
              appointmentDate: true,
              vetId: true,
            },
          },
        },
      });
    }

    console.log("Pets data from API:", pets);
    return new NextResponse(JSON.stringify(pets), { status: 200 });
  } catch (error) {
    console.error("Error fetching pets:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to fetch pets" }), { status: 500 });
  }
}


