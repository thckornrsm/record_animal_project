"use client";
import { useRouter } from "next/navigation";
export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <section className="flex flex-col items-center justify-center flex-grow text-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white py-20">
        <h1 className="text-5xl font-bold mb-4">Track Your Pet's Health Easily</h1>
        <p className="text-lg max-w-2xl">
          Manage and monitor your pet's medical history, appointments, and health records seamlessly.
        </p>
        <button
          className="mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition"
          onClick={() => router.push("/dashboard")}
        >
          Get Started
        </button>
      </section>
      
      <section className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          <div className="p-6 bg-gray-100 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">Health Records</h3>
            <p className="text-gray-600">Store and manage all your pet's medical history in one place.</p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">Vet Appointments</h3>
            <p className="text-gray-600">Schedule appointments with veterinarians effortlessly.</p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">Secure & Reliable</h3>
            <p className="text-gray-600">Your pet's health data is safe and accessible anywhere.</p>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 text-center py-4 mt-auto">
        © 2025 Pet Health Tracker. All rights reserved.
      </footer>
    </div>
  );
}
