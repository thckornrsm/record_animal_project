"use client";

import { useContext } from "react";
import AuthContext from "@/app/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();


  if (pathname.startsWith("/auth")) return null;

  
  const handleHomeClick = () => {
    if (auth.user?.role === "ADMIN") {
      router.push("/admin");
    } else if (auth.user?.role === "OWNER") {
      router.push("/dashboard");
    } else if (auth.user?.role === "VETERINARIAN") {
      router.push("/dashboard/vet");
    } else {
      router.push("/"); 
    }
  };
  const handleLogoutClick = () => {
    if (auth.user?.role === "ADMIN") {
      router.push("/");
    } else if (auth.user?.role === "OWNER") {
      router.push("/");
    } else if (auth.user?.role === "VETERINARIAN") {
      router.push("/");
    } else {
      router.push("/"); 
    }
  };

  return (
    <nav className="p-4 bg-gray-900 text-white flex justify-between items-center shadow-md">
      {/* 🔹 ปุ่ม Home */}
      <button onClick={handleHomeClick} className="text-xl font-bold text-indigo-400">
        🐶 MyPetDiary
      </button>

      <div className="flex items-center space-x-6">
        <Link href="/us/about" className="hover:text-indigo-300">About Us</Link>
        <Link href="/us/contact" className="hover:text-indigo-300">Contact Us</Link>

      
        {auth.user?.role === "ADMIN" && (
          <Link href="/admin" className="hover:text-indigo-300">Admin Dashboard</Link>
        )}

      
        {auth.user ? (
          <>
            <span className="text-sm font-semibold">
               <span className="text-indigo-300">{auth.user.email}</span>
            </span>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              onClick={() => {
                auth.logout();
                router.push("/");
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Login</Link>
            <Link href="/auth/register" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
