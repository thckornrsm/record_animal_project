"use client";

import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import AuthContext from "@/app/contexts/AuthContext";

export default function AddPet() {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState<number | string>("");
  const [weight, setWeight] = useState<number | string>("");
  const [gender, setGender] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

 
  useEffect(() => {
    if (!auth?.user) {
      router.replace("/auth/login");
    } else {
      console.log("✅ Authenticated User:", auth.user); 
    }
  }, [auth?.user, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("📤 Sending Data:", { name, species, breed, age, weight, gender, image });
  
    if (!name || !species || !breed || !age || !weight || !gender || !image) {
      setErrorMessage("❌ Please fill all the fields.");
      return;
    }
  
    if (!auth?.user?.ownerId) {
      setErrorMessage("❌ Owner ID not found. Please login again.");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", name);
    formData.append("species", species);
    formData.append("breed", breed);
    formData.append("age", age.toString());
    formData.append("weight", weight.toString());
    formData.append("gender", gender);
    formData.append("ownerId", auth.user.ownerId.toString());
    formData.append("image", image);
  
    try {
      const response = await axios.post("/api/pets", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.status === 201) {
        setSuccessMessage("✅ Pet added successfully!");
        router.push("/dashboard/pet");
      }
    } catch (error) {
      console.error("❌ Error adding pet:", error);
      setErrorMessage("❌ Failed to add pet.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-gray-900">Add New Pet</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}

        <div>
          <label htmlFor="name" className="block text-gray-700">Pet Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter pet name"
            required
          />
        </div>

        <div>
          <label htmlFor="species" className="block text-gray-700">Species</label>
          <input
            type="text"
            id="species"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter pet species"
            required
          />
        </div>

        <div>
          <label htmlFor="breed" className="block text-gray-700">Breed</label>
          <input
            type="text"
            id="breed"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter pet breed"
            required
          />
        </div>

        <div>
          <label htmlFor="age" className="block text-gray-700">Age (years)</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter pet age"
            required
          />
        </div>

        <div>
          <label htmlFor="weight" className="block text-gray-700">Weight (kg)</label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter pet weight"
            required
          />
        </div>

        <div>
          <label htmlFor="gender" className="block text-gray-700">Gender</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div>
          <label htmlFor="image" className="block text-gray-700">Upload Image</label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
        >
          Add Pet
        </button>
      </form>
    </div>
  );
}
