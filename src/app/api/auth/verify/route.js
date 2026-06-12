import { NextResponse } from 'next/server';
import { verifyToken } from '../route';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    const token = request.cookies.get('admin_token')?.value;

    if (!verifyToken(token)) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true });
}
