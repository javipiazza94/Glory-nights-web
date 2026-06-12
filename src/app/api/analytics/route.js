/**
 * /api/analytics — Cookie-free Event Tracking
 * ─────────────────────────────────────────────────────────────────
 * POST: Registra un evento de analytics (page_view, cta_click, etc.)
 *       Almacena los eventos en la BD local sin usar cookies.
 * GET:  Devuelve los eventos (requiere autenticación del promotor).
 *
 * Estructura del payload POST:
 *   {
 *     event: 'cta_click',
 *     metadata: { button: 'hero_comprar' },
 *     url: '/conciertos',
 *     referrer: 'https://google.com',
 *     timestamp: '2026-03-06T12:00:00Z'
 *   }
 */
import { NextResponse } from 'next/server';
import { client, ensureDb } from '../../../../database';
import { withAuth } from '../../lib/apiWrapper';

export const dynamic = 'force-dynamic';

// ── POST: Registrar evento (público, sin auth) ──────────────
export async function POST(request) {
    await ensureDb();
    try {
        const { event, metadata, url, referrer, timestamp } = await request.json();

        if (!event) {
            return NextResponse.json(
                { error: 'El campo "event" es obligatorio.' },
                { status: 400 }
            );
        }

        await client.execute({
            sql: `INSERT INTO analytics_events (event_name, metadata, page_url, referrer, event_timestamp)
                  VALUES (?, ?, ?, ?, ?)`,
            args: [
                event,
                metadata ? JSON.stringify(metadata) : null,
                url || null,
                referrer || null,
                timestamp || new Date().toISOString(),
            ],
        });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error('Analytics POST error:', error);
        return NextResponse.json(
            { error: 'Error al registrar evento' },
            { status: 500 }
        );
    }
}

// ── GET: Consultar eventos (requiere auth) ──────────────────
export function GET(request) {
    return withAuth(request, async () => {
        const url = new URL(request.url);
        const limit = parseInt(url.searchParams.get('limit') || '100', 10);
        const eventFilter = url.searchParams.get('event') || null;

        let sql = 'SELECT * FROM analytics_events';
        const args = [];

        if (eventFilter) {
            sql += ' WHERE event_name = ?';
            args.push(eventFilter);
        }

        sql += ' ORDER BY id DESC LIMIT ?';
        args.push(limit);

        const { rows } = await client.execute({ sql, args });
        return NextResponse.json(rows);
    });
}
