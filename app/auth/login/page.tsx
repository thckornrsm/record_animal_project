"use client"; 

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "@/app/contexts/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const auth = useContext(AuthContext);
    const router = useRouter();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");
    
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
    
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Login failed");
    
            
            localStorage.setItem("token", data.token);
            console.log("Token:", localStorage.getItem("token"));
            auth?.login(data.token, data.user, data.owner);
    
            if (data.user.role === "ADMIN") {
                router.push("/admin");
            } else if (data.user.role === "OWNER") {
                router.push("/dashboard");
            } else if (data.user.role === "VETERINARIAN") {
                router.push("/dashboard/vet");
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500">
            <div className="relative bg-white/20 backdrop-blur-lg border border-white/30 p-8 rounded-2xl shadow-xl max-w-md w-full transition-all duration-300 transform hover:scale-105">
                <h1 className="text-4xl font-extrabold text-center text-white mb-6 drop-shadow-lg">Welcome Back</h1>

                {error && <p className="text-red-600 text-center bg-red-100 p-3 rounded-md">{error}</p>}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-white">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 w-full p-3 bg-white/30 border border-white/50 rounded-lg focus:ring-2 focus:ring-white focus:outline-none placeholder-white/70 text-white"
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
                            className="mt-1 w-full p-3 bg-white/30 border border-white/50 rounded-lg focus:ring-2 focus:ring-white focus:outline-none placeholder-white/70 text-white"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-lg font-bold hover:scale-105 transition-transform duration-300 shadow-lg"
                    >
                        Login
                    </button>
                </form>

                <p className="mt-6 text-sm text-center text-white/90">
                    Don't have an account?{" "}
                    <a href="/auth/register" className="text-white font-semibold hover:underline">
                        Register here
                    </a>
                </p>

                <button
                    onClick={() => router.push("/")}
                    className="mt-6 w-full bg-white/30 text-white p-3 rounded-lg font-bold hover:scale-105 transition transform duration-300 shadow-lg"
                >
                    ← Back to Home
                </button>
            </div>
        </div>
    );
}
