import { NextResponse } from 'next/server';
import { client, ensureDb } from '../../../../database';
import { withAuth } from '../../lib/apiWrapper';

export const dynamic = 'force-dynamic';

export async function GET() {
    await ensureDb();
    try {
        const { rows } = await client.execute('SELECT * FROM venues');
        return NextResponse.json(rows, {
            headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch venues' }, { status: 500 });
    }
}

export function POST(request) {
    return withAuth(request, async () => {
        const { name, location, capacity, contactEmail, imageUrl, videoUrl, description } = await request.json();
        if (!name || !location) {
            return NextResponse.json({ error: 'Nombre y Ubicación son obligatorios.' }, { status: 400 });
        }
        const result = await client.execute({
            sql: 'INSERT INTO venues (name, location, capacity, contactEmail, imageUrl, videoUrl, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
            args: [name, location, capacity || null, contactEmail || null, imageUrl || null, videoUrl || null, description || null]
        });
        return NextResponse.json({ id: result.lastInsertRowid?.toString(), success: true }, { status: 201 });
    });
}

export function PUT(request) {
    return withAuth(request, async () => {
        const { id, name, location, capacity, contactEmail, imageUrl, videoUrl, description } = await request.json();
        await client.execute({
            sql: 'UPDATE venues SET name = ?, location = ?, capacity = ?, contactEmail = ?, imageUrl = ?, videoUrl = ?, description = ? WHERE id = ?',
            args: [name, location, capacity || null, contactEmail || null, imageUrl || null, videoUrl || null, description || null, id]
        });
        return NextResponse.json({ success: true });
    });
}

export function DELETE(request) {
    return withAuth(request, async () => {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        await client.execute({
            sql: 'DELETE FROM venues WHERE id = ?',
            args: [id]
        });
        return NextResponse.json({ success: true });
    });
}
