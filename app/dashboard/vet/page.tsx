"use client";

import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "@/app/contexts/AuthContext";
import axios from "axios";

interface MedicalRecord {
    record_id: number;
    diagnosis: string;
    treatment: string;
    appointmentDate: string | null;
    vet_id: number;
    pet_id: number; 
}

interface Pet {
    pet_id: number;
    name: string;
    species: string;
    breed: string;
    age: number;
    weight: number;
    medicalRecords: MedicalRecord[];
}

export default function VetDashboard() {
    const auth = useContext(AuthContext);
    const router = useRouter();
    const [pets, setPets] = useState<Pet[]>([]);
    const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null); 

    useEffect(() => {
        if (!auth?.user || auth.user.role !== "VETERINARIAN") {
            if (!localStorage.getItem("token")) return;
            router.replace("/auth/login");
        }
    }, [auth?.user, router]);

    const fetchPets = async () => {
        try {
            const response = await axios.get(`/api/pets?vetId=${auth.user?.vetId}`);
            console.log("Pets data:", response.data); 
            setPets(response.data); 
        } catch (error) {
            console.error("❌ Error fetching pets:", error);
        }
    };

    useEffect(() => {
        if (auth?.user?.vetId) {
            fetchPets();
        }
    }, [auth?.user?.vetId]);

    const handleDeleteRecord = async (recordId: number) => {
        try {
            const response = await axios.delete(`/api/medical-records/${recordId}`, {
                data: { vetId: auth.user?.vetId }  
            });
        
            if (response.status === 200) {
                alert("✅ Medical record deleted successfully.");
                fetchPets(); 
                setSelectedRecord(null); 
            }
        } catch (error) {
            console.error("❌ Error deleting medical record:", error);
            alert("❌ Failed to delete medical record.");
        }
    };

    if (!auth?.user) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500">
                <p className="text-lg font-semibold text-white animate-pulse">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700">
            <div className="relative bg-white/20 backdrop-blur-xl border border-white/30 p-8 rounded-2xl shadow-2xl max-w-lg w-full transition-all duration-300 transform hover:scale-105">
                <h1 className="text-4xl font-extrabold text-center text-white mb-6 drop-shadow-lg">Veterinarian Dashboard</h1>
                <p className="text-lg text-center text-white mb-6">
                    <span className="font-semibold text-yellow-300">{auth.user?.name}</span>
                </p>
                <div className="mt-6 space-y-4">
                    <button
                        onClick={() => router.push("/dashboard/vet/medical-records")}
                        className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg font-bold shadow-lg hover:scale-105 transition-transform duration-300"
                    >
                        📋 Manage Medical Records
                    </button>

                    
                </div>
            </div>

            
            <div className="mt-10 bg-white/30 p-6 rounded-lg shadow-lg max-w-3xl w-full">
                <h2 className="text-2xl font-semibold text-white mb-4">🩺 Pets You Have Treated</h2>
                <ul className="space-y-3">
                    {pets.length > 0 ? (
                        pets.map((pet) => (
                            <li key={pet.pet_id} className="bg-white/80 p-3 rounded-md shadow">
                                <strong>Pet:</strong> {pet.name} ({pet.species}) <br />
                                <strong>Breed:</strong> {pet.breed} <br />
                                <strong>Age:</strong> {pet.age} years <br />
                                <strong>Weight:</strong> {pet.weight} kg <br />
                                <strong>Medical Records:</strong>
                                {pet.medicalRecords.length > 0 ? (
                                    <ul className="ml-4">
                                        {pet.medicalRecords.map((record, index) => (
                                            <li key={index} className="text-gray-700">
                                                🏥 {record.diagnosis} | 💊 {record.treatment} | 📅{" "}
                                                {record.appointmentDate
                                                    ? new Date(record.appointmentDate).toLocaleDateString()
                                                    : "No appointment date"}
                                                {/* ลบการรักษาที่เลือก */}
                                                <button
                                                    onClick={() => setSelectedRecord(record)}
                                                    className="ml-2 text-red-500"
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No medical records found.</p>
                                )}
                            </li>
                        ))
                    ) : (
                        <p className="text-white">No pets found.</p>
                    )}
                </ul>
            </div>

            
            {selectedRecord && (
                <div className="mt-4">
                    <button
                        onClick={() => handleDeleteRecord(selectedRecord.record_id)}
                        className="w-full bg-red-600 text-white p-3 rounded-lg font-semibold"
                    >
                        Confirm Delete
                    </button>
                </div>
            )}
        </div>
    );
}
