import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export interface JWTPayload {
    userId: string;
    email: string;
    role: 'admin' | 'editor';
}

export function signToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch {
        return null;
    }
}

export function getTokenFromRequest(request: NextRequest): string | null {
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }

    const cookieToken = request.cookies.get('auth-token')?.value;
    return cookieToken || null;
}

export function validateRequest(request: NextRequest): JWTPayload | null {
    const token = getTokenFromRequest(request);
    if (!token) return null;
    return verifyToken(token);
}

export function requireAdmin(request: NextRequest): JWTPayload {
    const payload = validateRequest(request);
    if (!payload) {
        throw new Error('Unauthorized');
    }
    if (payload.role !== 'admin') {
        throw new Error('Forbidden: Admin access required');
    }
    return payload;
}
