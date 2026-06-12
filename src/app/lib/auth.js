import { NextResponse } from 'next/server';
import { verifyToken } from '../api/auth/route';

/**
 * Validates the admin authentication cookie using stateless HMAC verification.
 * Returns null if authenticated, or a 401 NextResponse if not.
 * Usage in API routes:
 *   const authError = requireAuth(request);
 *   if (authError) return authError;
 */
export function requireAuth(request) {
    const token = request.cookies.get('admin_token')?.value;

    if (!verifyToken(token)) {
        return NextResponse.json(
            { error: 'No autorizado. Inicia sesión en el panel del promotor.' },
            { status: 401 }
        );
    }

    return null; // Authenticated
}
