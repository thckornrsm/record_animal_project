import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();


const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });


const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

export const config = { api: { bodyParser: false } };



export async function GET(request: Request, { params }: { params: Promise<{ petCode: string }> }) {
  const { petCode } = await params;


  const pet = await prisma.pet.findUnique({
    where: { pet_code: petCode },
  });

  if (!pet) {
    return new Response(JSON.stringify({ error: 'Pet not found' }), { status: 404 });
  }

  return new Response(JSON.stringify(pet), { status: 200 });
}


export async function PUT(req: Request, { params }: { params: { petCode: string } }) {
    return new Promise((resolve, reject) => {
      
        upload.single("image")(req as any, {} as any, async (err) => {
            if (err) {
                return resolve(new Response(JSON.stringify({ error: "Upload failed" }), { status: 500 }));
            }

            try {
                const petCode = params.petCode;
                const body = await req.formData();
                const name = body.get("name");
                const species = body.get("species");
                const breed = body.get("breed");
                const age = body.get("age");
                const weight = body.get("weight");
                const gender = body.get("gender");
                const image = body.get("image") as File;

         
                if (!name || !species || !breed || !age || !weight || !gender) {
                    return resolve(new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 }));
                }

             
                let imagePath = undefined;
                if (image) {
                    const filename = `${Date.now()}-${image.name}`;
                    const filePath = path.join(uploadDir, filename);

               
                    const buffer = Buffer.from(await image.arrayBuffer());
                    fs.writeFileSync(filePath, buffer);

                
                    imagePath = `/uploads/${filename}`;
                }

       
                const updatedPet = await prisma.pet.update({
                    where: { pet_code: petCode },
                    data: {
                        name: String(name),
                        species: String(species),
                        breed: String(breed),
                        age: Number(age),
                        weight: Number(weight),
                        gender: String(gender),
                        image: imagePath, 
                    },
                });

                return resolve(new Response(JSON.stringify(updatedPet), { status: 200 }));
            } catch (error) {
                console.error("❌ Error:", error);
                return resolve(new Response(JSON.stringify({ error: "Failed to update pet" }), { status: 500 }));
            }
        });
    });
}



export async function DELETE(req: Request, { params }: { params: { petCode: string } }) {
  try {
    const petCode = params.petCode;

    console.log("🔍 Attempting to delete pet with petCode:", petCode);


    const pet = await prisma.pet.findFirst({
      where: { pet_code: petCode },
    });

    if (!pet) {
      console.warn("⚠️ Pet not found:", petCode);
      return new Response(JSON.stringify({ error: "Pet not found" }), { status: 404 });
    }

    console.log("✅ Found pet:", pet);

 
    await prisma.$transaction([
      prisma.medical_Record.deleteMany({
        where: { petId: pet.pet_id }, 
      }),
      prisma.pet.delete({
        where: { pet_id: pet.pet_id }, 
      }),
    ]);

    console.log("✅ Pet and related medical records deleted successfully:", petCode);

    return new Response(JSON.stringify({ message: "Pet and related medical records deleted successfully" }), { status: 200 });
  } catch (error: any) {
    console.error("❌ Error deleting pet and medical records:", error);

    if (error.code === "P2025") {
      return new Response(JSON.stringify({ error: "Pet not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ error: "Failed to delete pet and medical records" }), { status: 500 });
  }
}

