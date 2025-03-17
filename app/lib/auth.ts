import jwt from 'jsonwebtoken';

interface DecodedToken {
    vetId: number;
    role: string; 
    email: string;
}

export async function getSession(token: string) {
    try {
        if (!token) {
            console.log("No token provided");
            return null;
        }

        const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
        
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

        console.log("Decoded token:", decoded);

      
        if (!decoded || !decoded.role || !decoded.vetId) {
            console.log("Invalid token data");
            return null;
        }

        return {
            vetId: decoded.vetId,
            role: decoded.role,
            email: decoded.email
        };
    } catch (error) {
        console.error("Error verifying token:", error);
        return null;
    }
}