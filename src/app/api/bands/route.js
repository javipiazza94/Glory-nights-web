import { NextResponse } from 'next/server';
import { client, ensureDb } from '../../../../database';
import { withAuth } from '../../lib/apiWrapper';

export const dynamic = 'force-dynamic';

export async function GET() {
    await ensureDb();
    try {
        const { rows } = await client.execute('SELECT * FROM bands');
        return NextResponse.json(rows, {
            headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch bands' }, { status: 500 });
    }
}

export function POST(request) {
    return withAuth(request, async () => {
        const { name, tributeTo, description, imageUrl, videoUrl } = await request.json();
        if (!name || !tributeTo) {
            return NextResponse.json({ error: 'Nombre y Tributo son obligatorios.' }, { status: 400 });
        }
        const result = await client.execute({
            sql: 'INSERT INTO bands (name, tributeTo, description, imageUrl, videoUrl) VALUES (?, ?, ?, ?, ?)',
            args: [name, tributeTo, description, imageUrl || null, videoUrl || null]
        });
        return NextResponse.json({ id: result.lastInsertRowid?.toString(), success: true }, { status: 201 });
    });
}

export function PUT(request) {
    return withAuth(request, async () => {
        const { id, name, tributeTo, description, imageUrl, videoUrl } = await request.json();
        await client.execute({
            sql: 'UPDATE bands SET name = ?, tributeTo = ?, description = ?, imageUrl = ?, videoUrl = ? WHERE id = ?',
            args: [name, tributeTo, description, imageUrl || null, videoUrl || null, id]
        });
        return NextResponse.json({ success: true });
    });
}

export function DELETE(request) {
    return withAuth(request, async () => {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        await client.execute({
            sql: 'DELETE FROM bands WHERE id = ?',
            args: [id]
        });
        return NextResponse.json({ success: true });
    });
}
