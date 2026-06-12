import { NextResponse } from 'next/server';
import { ensureDb } from '../../../database';
import { requireAuth } from './auth';

export function withAuth(request, handler) {
    const authError = requireAuth(request);
    if (authError) return authError;
    return ensureDb()
        .then(() => handler())
        .catch(error => {
            console.error(error);
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        });
}
