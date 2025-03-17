  "use client";

  import { useContext, useState, useEffect, FormEvent } from "react";
  import { useRouter } from "next/navigation";
  import AuthContext from "@/app/contexts/AuthContext";
  import axios from "axios";

  interface Pet {
    pet_id: number;
    pet_code: string;
    name: string;
    species: string;
    breed: string;
    age: number;
    weight: number;
    gender: string;
    image: string | File;
    medicalRecords?: { 
      record_id: number;
      diagnosis: string;
      treatment: string;
      appointmentDate: string;
    }[]; 
  }

  export default function DashboardPage() {
    const auth = useContext(AuthContext);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pets, setPets] = useState<Pet[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false); 
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);  
    const [isEditing, setIsEditing] = useState(false);
    const [editedOwner, setEditedOwner] = useState(auth?.owner || {
      name: "",
      email: "",
      phone: "",
      address: "",
      gender: "Male",
    });
    useEffect(() => {
      if (auth?.owner) {
        setEditedOwner(auth.owner);
      }
    }, [auth?.owner]);


    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsAuthenticated(true);
      } else {
        router.replace("/auth/login");
      }
      setLoading(false);
    }, [router]);

    useEffect(() => {
      if (auth?.user?.ownerId) {
        const fetchPets = async () => {
          try {
            const response = await axios.get(`/api/pets?ownerId=${auth.user?.ownerId}`);
            setPets(response.data);
          } catch (error) {
            console.error("Error fetching pets:", error);
          }
        };
        fetchPets();
      }
    }, [auth?.user?.ownerId]);

    const openEditModal = (pet: Pet) => {
      setSelectedPet(pet);
      setIsModalOpen(true);
    };

    const openViewModal = (pet: Pet) => {
      setSelectedPet(pet);
      setIsViewModalOpen(true); 
    };

    const openProfileModal = () => {
      setIsProfileModalOpen(true);  
    };

    const closeModal = () => {
      setIsModalOpen(false);
      setIsViewModalOpen(false); 
      setIsProfileModalOpen(false);  
      setSelectedPet(null);
    };
    const handleSaveProfile = async () => {
      try {
        const response = await axios.put(`/api/owners/${auth?.owner?.owner_id}`, editedOwner);
        if (response.status === 200) {
          alert("Profile updated successfully!");
          setIsEditing(false); 
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile.");
      }
    };
    

    const handleDelete = async (pet_code: string) => {
      if (!confirm("Are you sure you want to delete this pet?")) return;
    
      try {
        const response = await axios.delete(`/api/pets/${pet_code}`);
    
        if (response.status === 200) {
          alert("Pet and related medical records deleted successfully!");
          setPets(pets.filter((pet) => pet.pet_code !== pet_code)); 
        } else {
          alert("Failed to delete pet.");
        }
      } catch (error: any) {
        console.error("Error deleting pet:", error);
        
        if (error.response?.status === 404) {
          alert("Pet not found.");
        } else {
          alert("Failed to delete pet and related medical records.");
        }
      }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files ? e.target.files[0] : null;
      if (file && selectedPet) {
        setSelectedPet({ ...selectedPet, image: file });
      }
    };

    const handleChange = (field: string, value: string | number) => {
      if (selectedPet) {
        if (field === "age" || field === "weight") {
        
          const numericValue = parseFloat(value as string);
          if (!isNaN(numericValue)) {
            setSelectedPet({ ...selectedPet, [field]: numericValue });
          } else {
            console.error(`${field} must be a number`);
          }
        } else {
          setSelectedPet({ ...selectedPet, [field]: value });
        }
      }
    };

    const handleSubmit = async (event: FormEvent) => {
      event.preventDefault();

      if (!selectedPet) return;

      const { pet_code, name, species, breed, age, weight, gender, image } = selectedPet;

      
      if (!name || !species || !breed || !age || !weight || !gender) {
        console.error("Missing required fields");
        return;
      }

      
      const validAge = !isNaN(age) && age > 0;
      const validWeight = !isNaN(weight) && weight > 0;

      if (!validAge || !validWeight) {
        console.error("Age or Weight is not valid");
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("species", species);
      formData.append("breed", breed);
      formData.append("age", age.toString());
      formData.append("weight", weight.toString());
      formData.append("gender", gender);

      if (image && image instanceof File) {
        formData.append("image", image);
      }

      try {
        
        const response = await axios.put(`/api/pets/${pet_code}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.status === 200) {
          
          setPets(pets.map((pet) => (pet.pet_code === pet_code ? selectedPet : pet)));
          setIsModalOpen(false);  
        }
      } catch (error) {
        console.error("Error updating pet:", error);
      }
    };

    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <p className="text-lg font-semibold text-gray-500">Loading...</p>
        </div>
      );
    }

    if (!isAuthenticated) return null;

    return (
      <div className="min-h-screen  flex justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
          <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-4">{auth?.owner?.name}</h1>
          <p className="text-lg text-gray-700 text-center mb-8">
            
          </p>

          <div className="space-y-8">
            <h2 className="text-3xl font-semibold text-gray-800">Your Pets</h2>
            {pets.length > 0 ? (
              <ul className="space-y-6">
                {pets.map((pet) => (
                  <li 
                    key={pet.pet_id} 
                    className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-6 hover:shadow-2xl transition-all cursor-pointer" 
                    onClick={() => openViewModal(pet)} 
                  >
                    {pet.image && (
                      <img 
                        src={typeof pet.image === 'string' ? pet.image : URL.createObjectURL(pet.image)} 
                        alt={pet.name} 
                        className="w-24 h-24 object-cover rounded-full border-2 border-indigo-500"
                      />
                    )}
                    <div className="flex-1">
                      <strong className="text-2xl font-semibold">{pet.name}</strong> ({pet.species}) <br />
                      <strong className="text-gray-600">Breed:</strong> {pet.breed} <br />
                      <strong className="text-gray-600">Age:</strong> {pet.age} years <br />
                      <strong className="text-gray-600">Weight:</strong> {pet.weight} kg
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); openEditModal(pet); }} 
                        className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(pet.pet_code); }} 
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">You have not added any pets yet.</p>
            )}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => router.push("/dashboard/pet")}
                className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition"
              >
                🐶 Add Pet
              </button>
            </div>
          </div>

          {/* Button to open Profile Modal */}
          <div className="absolute top-16 right-4">
            <button
              onClick={openProfileModal}
              className="px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition"
            >
              👤 View Profile
            </button>
          </div>

        </div>

        {isProfileModalOpen && auth?.owner && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
    <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-700">Profile Details</h2>
      <div className="space-y-4">
        {!isEditing ? (
          <>
            <div><strong>Name: </strong>{auth.owner.name}</div>
            <div><strong>Email: </strong>{auth.owner.email}</div>
            <div><strong>Phone: </strong>{auth.owner.phone}</div>
            <div><strong>Address: </strong>{auth.owner.address}</div>
            <div><strong>Gender: </strong>{auth.owner.gender}</div>
            <button onClick={() => setIsEditing(true)} className="w-full px-6 py-3 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 mt-4">
              ✏️ Edit
            </button>
          </>
        ) : (
          <>
            <input type="text" value={editedOwner.name} onChange={(e) => setEditedOwner({ ...editedOwner, name: e.target.value })} className="w-full p-3 border border-gray-300 rounded-md" />
            <input type="text" value={editedOwner.email} onChange={(e) => setEditedOwner({ ...editedOwner, email: e.target.value })} className="w-full p-3 border border-gray-300 rounded-md" />
            <input type="text" value={editedOwner.phone} onChange={(e) => setEditedOwner({ ...editedOwner, phone: e.target.value })} className="w-full p-3 border border-gray-300 rounded-md" />
            <input type="text" value={editedOwner.address} onChange={(e) => setEditedOwner({ ...editedOwner, address: e.target.value })} className="w-full p-3 border border-gray-300 rounded-md" />
            <select value={editedOwner.gender} onChange={(e) => setEditedOwner({ ...editedOwner, gender: e.target.value })} className="w-full p-3 border border-gray-300 rounded-md">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <button onClick={handleSaveProfile} className="w-full px-6 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 mt-4">
               Save
            </button>
            <button onClick={() => setIsEditing(false)} className="w-full px-6 py-3 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 mt-2">
               Cancel
            </button>
          </>
        )}
        <button onClick={closeModal} className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 mt-4">
          Close
        </button>
      </div>
    </div>
  </div>
)}

        {isViewModalOpen && selectedPet && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl">
              <h2 className="text-2xl font-bold text-center mb-4 text-gray-700">Pet Details</h2>
              <div className="space-y-4">
                <div className="flex justify-center">
                  {selectedPet.image && (
                    <img 
                      src={typeof selectedPet.image === 'string' ? selectedPet.image : URL.createObjectURL(selectedPet.image)} 
                      alt={selectedPet.name} 
                      className="w-36 h-36 object-cover rounded-full border-4 border-indigo-500"
                    />
                  )}
                </div>
                <div>
                  <strong className="text-gray-800">Name: </strong>{selectedPet.name}
                </div>
                <div>
                  <strong className="text-gray-800">Species: </strong>{selectedPet.species}
                </div>
                <div>
                  <strong className="text-gray-800">Breed: </strong>{selectedPet.breed}
                </div>
                <div>
                  <strong className="text-gray-800">Age: </strong>{selectedPet.age} years
                </div>
                <div>
                  <strong className="text-gray-800">Weight: </strong>{selectedPet.weight} kg
                </div>
                <div>
                  <strong className="text-gray-800">Gender: </strong>{selectedPet.gender}
                </div>

            
                {selectedPet.medicalRecords && selectedPet.medicalRecords.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">Medical Records</h3>
                    {selectedPet.medicalRecords.map((record) => (
                      <div key={record.record_id} className="bg-gray-100 p-4 rounded-md">
                        <div><strong>Diagnosis:</strong> {record.diagnosis}</div>
                        <div><strong>Treatment:</strong> {record.treatment}</div>
                        <div><strong>Appointment Date:</strong> {record.appointmentDate}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No medical records available.</p>
                )}

                <button
                  onClick={closeModal}
                  className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 mt-4"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

    
        {isModalOpen && selectedPet && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl">
              <h2 className="text-2xl font-bold text-center mb-4 text-gray-700">Edit Pet</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-gray-700">Pet Name</label>
                  <input
                    type="text"
                    id="name"
                    value={selectedPet.name}
                    onChange={(e) => setSelectedPet({ ...selectedPet, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter pet name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="species" className="block text-gray-700">Species</label>
                  <input
                    type="text"
                    id="species"
                    value={selectedPet.species}
                    onChange={(e) => setSelectedPet({ ...selectedPet, species: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter pet species"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="breed" className="block text-gray-700">Breed</label>
                  <input
                    type="text"
                    id="breed"
                    value={selectedPet.breed}
                    onChange={(e) => setSelectedPet({ ...selectedPet, breed: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter pet breed"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="age" className="block text-gray-700">Age (years)</label>
                  <input
                    type="number"
                    id="age"
                    value={selectedPet.age || ""}  
                    onChange={(e) => setSelectedPet({ ...selectedPet, age: parseInt(e.target.value) || 0 })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter pet age"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="weight" className="block text-gray-700">Weight (kg)</label>
                  <input
                    type="number"
                    id="weight"
                    value={selectedPet.weight || ""}  
                    onChange={(e) => setSelectedPet({ ...selectedPet, weight: parseFloat(e.target.value) || 0 })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter pet weight"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-gray-700">Gender</label>
                  <select
                    id="gender"
                    value={selectedPet.gender}
                    onChange={(e) => setSelectedPet({ ...selectedPet, gender: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    required
                  >
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
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
                >
                  Update Pet
                </button>
              </form>
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white"
              >
                X
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
