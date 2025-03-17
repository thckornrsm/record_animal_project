"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [gender, setGender] = useState(""); 
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!name || !phone || !gender) { 
            setError("Please enter all required fields");
            return;
        }

        const payload = { email, password, role: "OWNER", name, phone, address, gender };

        try {
            const response = await axios.post("/api/auth/register", payload);

            if (response.status === 201) {
                alert("Registration successful! Please login.");
                router.push("/auth/login");
            }
        } catch (err) {
            setError("Registration failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500">
            <div className="relative bg-white/20 backdrop-blur-xl border border-white/30 p-8 rounded-2xl shadow-2xl max-w-md w-full">
                <h1 className="text-4xl font-extrabold text-center text-white mb-6 drop-shadow-lg">Step 1: Account Setup</h1>

                {error && <p className="text-red-500 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-white">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 w-full p-3 bg-white/30 border border-white/50 rounded-lg text-white"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-white">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 w-full p-3 bg-white/30 border border-white/50 rounded-lg text-white"
                            placeholder="Enter your password"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-white">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-1 w-full p-3 bg-white/30 border border-white/50 rounded-lg text-white"
                            placeholder="Enter full name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-white">Phone Number</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="mt-1 w-full p-3 bg-white/30 border border-white/50 rounded-lg text-white"
                            placeholder="Enter phone number"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-white">Address</label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            className="mt-1 w-full p-3 bg-white/30 border border-white/50 rounded-lg text-white"
                            placeholder="Enter your address"
                        />
                    </div>

                    {/* ช่องเลือกเพศ (Gender) */}
                    <div>
                        <label className="block text-sm font-semibold text-white">Gender</label>
                        <div className="flex items-center gap-4 mt-1">
                            <label className="text-white">
                                <input
                                    type="radio"
                                    value="Male"
                                    checked={gender === "Male"}
                                    onChange={() => setGender("Male")}
                                    className="mr-2"
                                />
                                Male
                            </label>
                            <label className="text-white">
                                <input
                                    type="radio"
                                    value="Female"
                                    checked={gender === "Female"}
                                    onChange={() => setGender("Female")}
                                    className="mr-2"
                                />
                                Female
                            </label>
                            <label className="text-white">
                                <input
                                    type="radio"
                                    value="Other"
                                    checked={gender === "Other"}
                                    onChange={() => setGender("Other")}
                                    className="mr-2"
                                />
                                Other
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-lg font-bold hover:scale-105 transition-transform duration-300 shadow-lg"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}
