import React, { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import axios from "axios";


interface User {
    token: any;
    id: number;
    email: string;
    role: string;
    name?: string; 
    vetId?: number;
    ownerId?: number;  
}


interface Owner {
    owner_id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    gender: string;
    role: string;
}


interface AuthContextType {
    user: User | null;
    owner: Owner | null;  
    token: string | null;
    login: (token: string, user: User, owner: Owner) => void;  
    logout: () => void;
}


const AuthContext = createContext<AuthContextType>({
    user: null,
    owner: null,  
    token: null,
    login: () => {},
    logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [owner, setOwner] = useState<Owner | null>(null); 
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            setToken(storedToken);
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser); 
            
           
            if (parsedUser?.ownerId) {
                fetchOwnerData(parsedUser.ownerId);
            }
        }
        setLoading(false); 
    }, []);

    
    const fetchOwnerData = async (ownerId: number) => {
        try {
            const response = await axios.get(`/api/owners/${ownerId}`);
            setOwner(response.data); 
        } catch (error) {
            console.error("Error fetching owner data:", error);
        }
    };

    const login = (newToken: string, userData: User, ownerData: Owner) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("owner", JSON.stringify(ownerData));  
    
        setToken(newToken);
        setUser(userData);
        setOwner(ownerData);  
    
        if (userData.role === "VETERINARIAN") {
            router.push("/dashboard");
        } else {
            router.push("/unauthorized");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("owner");  
        setToken(null);
        setUser(null);
        setOwner(null);  
        router.push("/auth/login");
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, owner, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
