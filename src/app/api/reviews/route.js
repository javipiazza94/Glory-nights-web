import { NextResponse } from 'next/server';
import { client, ensureDb } from '../../../../database';
import { requireAuth } from '../../lib/auth';

export const dynamic = 'force-dynamic';

// GET — Public: fetch visible reviews (with concert & subscriber info)
export async function GET() {
    await ensureDb();
    try {
        const { rows } = await client.execute(`
            SELECT
                r.*,
                c.id    AS linked_concert_id,
                b.name  AS concert_band_name,
                v.name  AS concert_venue_name,
                v.location AS concert_venue_location,
                c.date  AS concert_date,
                s.email AS subscriber_email,
                s.name  AS subscriber_name
            FROM reviews r
            LEFT JOIN concerts  c ON r.concert_id    = c.id
            LEFT JOIN bands     b ON c.band_id        = b.id
            LEFT JOIN venues    v ON c.venue_id       = v.id
            LEFT JOIN subscribers s ON r.subscriber_id = s.id
            WHERE r.visible = 1
            ORDER BY r.created_at DESC
        `);
        return NextResponse.json(rows, {
            headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}

/**
 * Resolves subscriber_id from an email address.
 * Returns null if no subscriber with that email exists.
 */
async function resolveSubscriberId(email) {
    if (!email) return null;
    try {
        const { rows } = await client.execute({
            sql: 'SELECT id FROM subscribers WHERE email = ? LIMIT 1',
            args: [email.toLowerCase().trim()],
        });
        return rows[0]?.id ?? null;
    } catch { return null; }
}

/**
 * If concert_id is provided, derives the concert_label automatically
 * from the linked concert row (BandName @ VenueName).
 * This prevents concert_label from drifting out of sync with concert_id.
 */
async function resolveConcertLabel(concert_id, fallbackLabel) {
    if (!concert_id) return fallbackLabel || null;
    try {
        const { rows } = await client.execute({
            sql: `SELECT b.name AS bandName, v.name AS venueName
                  FROM concerts c
                  LEFT JOIN bands b  ON c.band_id  = b.id
                  LEFT JOIN venues v ON c.venue_id = v.id
                  WHERE c.id = ?`,
            args: [concert_id],
        });
        if (rows[0]) {
            return `${rows[0].bandName || '?'} @ ${rows[0].venueName || '?'}`;
        }
    } catch { /* fall through */ }
    return fallbackLabel || null;
}

// POST — Admin: create a new review
export async function POST(request) {
    const authError = requireAuth(request);
    if (authError) return authError;

    await ensureDb();
    try {
        const { author, text, concert_label, concert_id, subscriber_email, stars, visible } = await request.json();
        if (!author || !text) {
            return NextResponse.json({ error: 'Autor y texto son obligatorios.' }, { status: 400 });
        }
        const [subscriber_id, resolved_label] = await Promise.all([
            resolveSubscriberId(subscriber_email),
            resolveConcertLabel(concert_id, concert_label),
        ]);
        const result = await client.execute({
            sql: `INSERT INTO reviews
                    (author, text, concert_label, concert_id, subscriber_id, stars, visible)
                  VALUES (?, ?, ?, ?, ?, ?, ?)`,
            args: [
                author,
                text,
                resolved_label,
                concert_id || null,
                subscriber_id,
                stars || 5,
                visible !== false ? 1 : 0,
            ],
        });
        return NextResponse.json({ id: result.lastInsertRowid?.toString(), success: true }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
    }
}

// PUT — Admin: update a review
export async function PUT(request) {
    const authError = requireAuth(request);
    if (authError) return authError;

    await ensureDb();
    try {
        const { id, author, text, concert_label, concert_id, subscriber_email, stars, visible } = await request.json();
        const [subscriber_id, resolved_label] = await Promise.all([
            resolveSubscriberId(subscriber_email),
            resolveConcertLabel(concert_id, concert_label),
        ]);
        await client.execute({
            sql: `UPDATE reviews
                  SET author = ?, text = ?, concert_label = ?, concert_id = ?,
                      subscriber_id = ?, stars = ?, visible = ?
                  WHERE id = ?`,
            args: [
                author,
                text,
                resolved_label,
                concert_id || null,
                subscriber_id,
                stars || 5,
                visible !== false ? 1 : 0,
                id,
            ],
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
    }
}

// DELETE — Admin: delete a review
export async function DELETE(request) {
    const authError = requireAuth(request);
    if (authError) return authError;

    await ensureDb();
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        await client.execute({ sql: 'DELETE FROM reviews WHERE id = ?', args: [id] });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
    }
}
