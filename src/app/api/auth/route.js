import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

/**
 * Creates a stateless signed token using HMAC-SHA256.
 * This works across serverless instances because it needs no shared memory.
 */
function createSignedToken() {
    const payload = `${crypto.randomUUID()}.${Date.now()}`;
    const secret = process.env.ADMIN_PASSWORD ?? 'no-secret-set';
    const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    return `${payload}.${sig}`;
}

export function verifyToken(tokenValue) {
    if (!tokenValue) return false;
    const lastDot = tokenValue.lastIndexOf('.');
    if (lastDot === -1) return false;
    const payload = tokenValue.slice(0, lastDot);
    const sig = tokenValue.slice(lastDot + 1);
    const secret = process.env.ADMIN_PASSWORD ?? 'no-secret-set';
    const expectedSig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig));
}

// POST = Login
export async function POST(request) {
    try {
        const { password } = await request.json();
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
            return NextResponse.json(
                { error: 'Autenticación no configurada en el servidor.' },
                { status: 503 }
            );
        }

        if (password !== adminPassword) {
            return NextResponse.json({ error: 'Contraseña incorrecta.' }, { status: 401 });
        }

        const token = createSignedToken();
        const response = NextResponse.json({ success: true });

        response.cookies.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 8, // 8 hours
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Error en el servidor.' }, { status: 500 });
    }
}

// DELETE = Logout
export async function DELETE() {
    const response = NextResponse.json({ success: true });
    response.cookies.delete('admin_token');
    return response;
}
