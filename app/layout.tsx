"use client";

import "./globals.css";
import { AuthProvider } from "@/app/contexts/AuthContext";
import Navbar from "@/app/components/navbar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

 
  const hideNavbarRoutes = ["/auth/login", "/auth/register"];
  const showNavbar = !hideNavbarRoutes.includes(pathname);

  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <AuthProvider>
          {showNavbar && <Navbar />} 
          <main className="container mx-auto px-4 py-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
