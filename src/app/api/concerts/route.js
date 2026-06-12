import { NextResponse } from 'next/server';
import { client, ensureDb } from '../../../../database';
import { withAuth } from '../../lib/apiWrapper';

export const dynamic = 'force-dynamic';

export async function GET() {
    await ensureDb();
    try {
        const query = `
      SELECT concerts.*, bands.name as bandName, bands.imageUrl as bandImage, venues.name as venueName, venues.location
      FROM concerts
      JOIN bands ON concerts.band_id = bands.id
      JOIN venues ON concerts.venue_id = venues.id
      ORDER BY concerts.date ASC
    `;
        const { rows } = await client.execute(query);
        return NextResponse.json(rows, {
            headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch concerts' }, { status: 500 });
    }
}

export function POST(request) {
    return withAuth(request, async () => {
        const { band_id, venue_id, date, ticketUrl, videoUrl, description } = await request.json();
        if (!band_id || !venue_id || !date) {
            return NextResponse.json({ error: 'Banda, Sala y Fecha son obligatorios.' }, { status: 400 });
        }
        const result = await client.execute({
            sql: 'INSERT INTO concerts (band_id, venue_id, date, ticketUrl, videoUrl, description) VALUES (?, ?, ?, ?, ?, ?)',
            args: [band_id, venue_id, date, ticketUrl || null, videoUrl || null, description || null]
        });
        return NextResponse.json({ id: result.lastInsertRowid?.toString(), success: true }, { status: 201 });
    });
}

export function PUT(request) {
    return withAuth(request, async () => {
        const { id, band_id, venue_id, date, ticketUrl, videoUrl, description } = await request.json();
        await client.execute({
            sql: 'UPDATE concerts SET band_id = ?, venue_id = ?, date = ?, ticketUrl = ?, videoUrl = ?, description = ? WHERE id = ?',
            args: [band_id, venue_id, date, ticketUrl || null, videoUrl || null, description || null, id]
        });
        return NextResponse.json({ success: true });
    });
}

export function DELETE(request) {
    return withAuth(request, async () => {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        await client.execute({
            sql: 'DELETE FROM concerts WHERE id = ?',
            args: [id]
        });
        return NextResponse.json({ success: true });
    });
}
