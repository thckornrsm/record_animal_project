"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "@/app/contexts/AuthContext";
import axios from "axios";
import Link from "next/link";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [owners, setOwners] = useState<{ owner_id: string; name: string; email: string }[]>([]);
  const [vets, setVets] = useState<{ vet_id: string; name: string; email: string; phone: string; speciality: string }[]>([]);
  
  const [showVetRegisterForm, setShowVetRegisterForm] = useState(false);
  const [showVetEditForm, setShowVetEditForm] = useState(false); 
  const [showOwnerEditForm, setShowOwnerEditForm] = useState(false);
  
  const [vetForm, setVetForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    speciality: "",
  });

  const [ownerForm, setOwnerForm] = useState({
    name: "",
    email: "",
  });

  const [selectedOwner, setSelectedOwner] = useState<any>(null); 
  const [selectedVet, setSelectedVet] = useState<any>(null); 

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    } else if (user.role !== "ADMIN") {
      router.push("/dashboard");
    } else {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const ownersResponse = await axios.get("/api/owners");
      setOwners(ownersResponse.data);
      const vetsResponse = await axios.get("/api/vets");
      setVets(vetsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleVetRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/vets", vetForm);
      if (response.status === 201) {
        alert("Vet registered successfully!");
        setVetForm({ email: "", password: "", name: "", phone: "",  speciality: "" });
        setShowVetRegisterForm(false);
        fetchData();
      }
    } catch (error) {
      console.error("❌ Error registering Vet:", error);
      alert("Failed to register Vet. Please try again later.");
    }
  };

  const handleVetEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVet) {
      alert("Please select a veterinarian to edit.");
      return;
    }
    try {
      const response = await axios.put(`/api/vets/${selectedVet.vet_id}`, vetForm);
      if (response.status === 200) {
        alert("Vet updated successfully!");
        setVetForm({ email: "", password: "", name: "", phone: "",  speciality: "" });
        setShowVetEditForm(false);
        fetchData();
      }
    } catch (error) {
      console.error("❌ Error updating Vet:", error);
    }
  };

  const handleOwnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/owners/${selectedOwner.owner_id}`, ownerForm);
      if (response.status === 200) {
        alert("Owner updated successfully!");
        setOwnerForm({ name: "", email: "" });
        setShowOwnerEditForm(false);
        fetchData();
      }
    } catch (error) {
      console.error("❌ Error updating Owner:", error);
    }
  };

  const handleDeleteVet = async (vet_id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this veterinarian?");
    if (confirmDelete) {
      try {
        const response = await axios.delete(`/api/vets/${vet_id}`);
        if (response.status === 200) {
          alert("Vet deleted successfully!");
          fetchData();
        } else {
          alert("Failed to delete vet.");
        }
      } catch (error) {
        console.error("❌ Error deleting Vet:", error);
        alert("Failed to delete vet.");
      }
    }
  };

  const handleDeleteOwner = async (owner_id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this owner?");
    if (confirmDelete) {
      try {
        const response = await axios.delete(`/api/owners/${owner_id}`);
        if (response.status === 200) {
          alert("Owner deleted successfully!");
          fetchData();
        } else {
          alert("Failed to delete owner.");
        }
      } catch (error) {
        console.error("❌ Error deleting Owner:", error);
        alert("Failed to delete owner.");
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">👑 Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        
        <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">👤 Owner List</h2>
          <ul>
            {owners.map((owner) => (
              <li key={owner.owner_id} className="border p-3 flex justify-between">
                <div>
                  <strong>{owner.name}</strong> - {owner.email}
                </div>
                <div>
                  <button
                    onClick={() => {
                      setSelectedOwner(owner);
                      setOwnerForm({ name: owner.name, email: owner.email });
                      setShowOwnerEditForm(true);
                    }}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteOwner(owner.owner_id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold ml-2"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        
        <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">🩺 Veterinarian List</h2>
          <ul>
            {vets.map((vet) => (
              <li key={vet.vet_id} className="border p-3 flex justify-between">
                <div>
                  <strong>{vet.name}</strong> - {vet.email} <br />
                  <span>Phone: {vet.phone}</span> <br />
                  <span>Speciality: {vet.speciality}</span>
                </div>
                <div>
                  <button
                    onClick={() => {
                      setSelectedVet(vet);
                      setVetForm({
                        email: vet.email,
                        password: "",
                        name: vet.name,
                        phone: vet.phone,
                        speciality: vet.speciality,
                      });
                      setShowVetEditForm(true);
                    }}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteVet(vet.vet_id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold ml-2"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

     
      <button
        onClick={() => setShowVetRegisterForm(true)}
        className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-600 transition"
      >
        Add Veterinarian
      </button>

      
      {showVetRegisterForm && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form onSubmit={handleVetRegister} className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Register Veterinarian</h2>
            <input
              type="email"
              placeholder="Email"
              value={vetForm.email}
              onChange={(e) => setVetForm({ ...vetForm, email: e.target.value })}
              className="w-full p-2 mb-3 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={vetForm.password}
              onChange={(e) => setVetForm({ ...vetForm, password: e.target.value })}
              className="w-full p-2 mb-3 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Name"
              value={vetForm.name}
              onChange={(e) => setVetForm({ ...vetForm, name: e.target.value })}
              className="w-full p-2 mb-3 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Phone"
              value={vetForm.phone}
              onChange={(e) => setVetForm({ ...vetForm, phone: e.target.value })}
              className="w-full p-2 mb-3 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Speciality"
              value={vetForm.speciality}
              onChange={(e) => setVetForm({ ...vetForm, speciality: e.target.value })}
              className="w-full p-2 mb-3 border border-gray-300 rounded-lg"
              required
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowVetRegisterForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg">
                Register
              </button>
            </div>
          </form>
        </div>
      )}

      
      {showVetEditForm && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form onSubmit={handleVetEdit} className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Edit Veterinarian</h2>
          
            <input
              type="text"
              placeholder="Name"
              value={vetForm.name}
              onChange={(e) => setVetForm({ ...vetForm, name: e.target.value })}
              className="w-full p-2 mb-3 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Phone"
              value={vetForm.phone}
              onChange={(e) => setVetForm({ ...vetForm, phone: e.target.value })}
              className="w-full p-2 mb-3 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Speciality"
              value={vetForm.speciality}
              onChange={(e) => setVetForm({ ...vetForm, speciality: e.target.value })}
              className="w-full p-2 mb-3 border border-gray-300 rounded-lg"
              required
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowVetEditForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Owner Edit Form */}
      {showOwnerEditForm && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form onSubmit={handleOwnerSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Edit Owner</h2>
            <input
              type="text"
              placeholder="Name"
              value={ownerForm.name}
              onChange={(e) => setOwnerForm({ ...ownerForm, name: e.target.value })}
              className="w-full p-2 mb-3 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={ownerForm.email}
              onChange={(e) => setOwnerForm({ ...ownerForm, email: e.target.value })}
              className="w-full p-2 mb-3 border border-gray-300 rounded-lg"
              required
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowOwnerEditForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
