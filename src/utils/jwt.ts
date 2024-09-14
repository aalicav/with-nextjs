import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface DecodedToken {
  userId: string;
  email: string;
  roles: string[];
  iat: number;
  exp: number;
}

export function validateToken(token: string): DecodedToken | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    
    // Verificar se o token expirou
    if (Date.now() >= decoded.exp * 1000) {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
}

export function generateToken(payload: { userId: string; email: string; roles: string[] }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
}