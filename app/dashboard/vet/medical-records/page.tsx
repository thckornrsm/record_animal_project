"use client";

import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import AuthContext from "@/app/contexts/AuthContext";
const jwt_decode = require("jwt-decode");

export default function ManageMedicalRecords() {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const [pets, setPets] = useState<any[]>([]);
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [petCode, setPetCode] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [filteredPets, setFilteredPets] = useState<any[]>([]);

  
  useEffect(() => {
    if (auth?.user?.token) {
      const decodedToken = jwt_decode(auth.user.token);
      console.log("🔹 Decoded Token:", decodedToken);

      if (decodedToken.role !== "VETERINARIAN") {
        setErrorMessage("Unauthorized: You do not have the required role.");
        router.push("/unauthorized");
      }
    }
  }, [auth?.user?.token, router]);

 
  const sortPetsByCode = (petsList: any[]) => {
    return petsList.sort((a, b) => a.pet_code.localeCompare(b.pet_code));
  };

  
  const fetchPets = async () => {
    if (!auth?.user?.vetId) {
      setErrorMessage("Vet ID is missing");
      return;
    }

    try {
      
      const response = await axios.get("/api/pets"); 
      const sortedPets = sortPetsByCode(response.data); 
      setPets(sortedPets);
      setFilteredPets(sortedPets);
    } catch (error) {
      console.error("Error fetching pets:", error);
      setErrorMessage("Failed to fetch pets");
    }
  };

  
  const handleSearchPet = async () => {
    if (!petCode) {
      setErrorMessage("Please enter a valid pet code.");
      return;
    }
    try {
      const response = await axios.get(`/api/pets/${petCode}`);
      if (response.data) {
        setSelectedPet(response.data);
        setFilteredPets([response.data]);
        setErrorMessage("");
      } else {
        setErrorMessage("Pet not found.");
        setSelectedPet(null);
        setFilteredPets([]);
      }
    } catch (error) {
      setErrorMessage("Failed to fetch pet.");
    }
  };

 
  const handleClearPetCode = () => {
    setPetCode("");
    setSelectedPet(null);
    setErrorMessage("");
    setFilteredPets(pets); 
  };

  useEffect(() => {
    if (auth?.user?.vetId) {
      fetchPets();
    }
  }, [auth?.user?.vetId]);

 
  useEffect(() => {
    console.log(filteredPets); 
  }, [filteredPets]); 

  if (!auth?.user) {
    return <div>Loading...</div>;
  }

  
  const handleSaveRecord = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
    event.preventDefault();

    if (!selectedPet) {
      setErrorMessage("❌ No pet selected.");
      return;
    }
    if (!diagnosis || !treatment) {
      setErrorMessage("❌ Please fill in both diagnosis and treatment.");
      return;
    }
    if (!auth?.user?.vetId) {
      setErrorMessage("❌ Vet ID is missing.");
      return;
    }

    const requestData = {
      pet_id: selectedPet.pet_id,
      diagnosis,
      treatment,
      appointmentDate: appointmentDate ? new Date(appointmentDate).toISOString() : null,
      vet_id: auth.user.vetId, 
    };

    console.log("📤 Sending Data:", requestData); 

    try {
      const response = await axios.post(`/api/medical-records`, requestData);
      console.log("✅ Response:", response.data);

      if (response.status === 201) {
        alert("✅ Medical record saved successfully.");
        setDiagnosis("");
        setTreatment("");
        setAppointmentDate("");
        setSelectedPet(null);
      } else {
        setErrorMessage("❌ Failed to save medical record.");
      }
    } catch (error) {
      console.error("❌ Error saving medical record:", error);

      if (axios.isAxiosError(error)) {
        console.log("🔴 Response Data:", error.response?.data);
        setErrorMessage(`❌ Axios error: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
      } else {
        setErrorMessage("❌ Failed to save medical record.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Manage Medical Records</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Search by Pet Code</label>
          <input
            type="text"
            value={petCode}
            onChange={(e) => setPetCode(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Enter pet code"
          />
          <button onClick={handleSearchPet} className="mt-2 w-full bg-blue-500 text-white p-3 rounded-lg font-bold">
            Search
          </button>
          <button onClick={handleClearPetCode} className="mt-2 w-full bg-gray-500 text-white p-3 rounded-lg font-bold">
            Clear
          </button>
        </div>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {!petCode && (
          <>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">All Pets (Sorted by Pet Code)</h3>
            <ul className="space-y-3 mb-4">
              {filteredPets.length > 0 &&
                filteredPets.map((pet) => (
                  <li key={`${pet.pet_id}-${pet.pet_code}`} className="bg-white/80 p-3 rounded-md shadow">
                    <strong>{pet.name}</strong> ({pet.species} - {pet.breed}) : {pet.pet_code}
                    {pet.medicalRecords?.length > 0 && (
                      <div className="mt-2">
                        <strong>Medical Records:</strong>
                        <ul className="ml-4">
                          {pet.medicalRecords.map((record: any, index: number) => (
                            <li key={index} className="text-gray-700">
                              🏥 {record.diagnosis} | 💊 {record.treatment} | 📅{" "}
                              {record.appointmentDate
                                ? new Date(record.appointmentDate).toLocaleDateString()
                                : "No appointment date"}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
            </ul>
          </>
        )}
        {selectedPet && (
          <div className="mt-4">
            <h3 className="text-xl font-semibold">{selectedPet.name} ({selectedPet.species})</h3>
            <div className="mb-4">
              <label className="block text-gray-700">Breed</label>
              <p>{selectedPet.breed}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Gender</label>
              <p>{selectedPet.gender}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Age</label>
              <p>{selectedPet.age} years old</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Owner</label>
              <p>{selectedPet.owner?.name} (Phone: {selectedPet.owner?.phone})</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Diagnosis</label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Treatment</label>
              <input
                type="text"
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Next Appointment Date</label>
              <input
                type="datetime-local"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <button
              onClick={handleSaveRecord}
              className="w-full bg-green-500 text-white p-3 rounded-lg font-semibold"
            >
              Save Medical Record
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
