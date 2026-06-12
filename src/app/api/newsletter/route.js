import { NextResponse } from 'next/server';
import { client, ensureDb } from '../../../../database';
import { requireAuth } from '../../lib/auth';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

// POST — Public: subscribe to newsletter
export async function POST(request) {
    try {
        await ensureDb();
        const { email, name, website } = await request.json();

        // Honeypot anti-spam
        if (website) {
            return NextResponse.json({ success: true }, { status: 201 });
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ error: 'Email inválido.' }, { status: 400 });
        }

        await client.execute({
            sql: 'INSERT OR IGNORE INTO subscribers (email, name) VALUES (?, ?)',
            args: [email.toLowerCase().trim(), name?.trim() || null],
        });

        // Welcome email
        if (process.env.RESEND_API_KEY) {
            const resend = new Resend(process.env.RESEND_API_KEY);
            await resend.emails.send({
                from: 'Glory Nights <onboarding@resend.dev>',
                to: email,
                subject: '🕯️ Ya formas parte de Glory Nights',
                html: `
                  <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;background:#0b0c10;color:#fff;border-radius:12px;overflow:hidden;">
                    <div style="background:linear-gradient(135deg,#1a1a2e,#0b0c10);padding:40px 40px 20px;text-align:center;border-bottom:1px solid rgba(197,160,89,0.3)">
                      <p style="font-size:0.85rem;letter-spacing:4px;text-transform:uppercase;color:#C5A059;margin:0 0 8px">Una experiencia musical inmersiva</p>
                      <h1 style="font-size:2rem;margin:0;color:#fff">Glory Nights</h1>
                    </div>
                    <div style="padding:40px;">
                      <p style="font-size:1.1rem;margin-top:0">Hola${name ? ` ${name}` : ''},</p>
                      <p style="line-height:1.8;color:#ccc">Gracias por suscribirte. A partir de ahora serás el primero en enterarte de nuestros nuevos conciertos, artistas y fechas especiales.</p>
                      <p style="line-height:1.8;color:#ccc">Te esperamos bajo la luz de las velas. ✨</p>
                      <div style="text-align:center;margin:32px 0;">
                        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://glorynightsconcerts.com'}/conciertos"
                          style="background:#C5A059;color:#0b0c10;text-decoration:none;padding:14px 32px;border-radius:6px;font-weight:700;font-family:sans-serif;letter-spacing:1px;font-size:0.9rem;">VER PRÓXIMOS CONCIERTOS</a>
                      </div>
                      <p style="font-size:0.8rem;color:#666;text-align:center;border-top:1px solid #222;padding-top:24px;">Si no te suscribiste, ignora este mensaje.</p>
                    </div>
                  </div>`,
            }).catch(() => { /* email failure is non-blocking */ });
        }

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error('Newsletter subscribe error:', error);
        return NextResponse.json({ error: 'Error al suscribirse.' }, { status: 500 });
    }
}

// GET — Admin: list all subscribers
export async function GET(request) {
    const authError = requireAuth(request);
    if (authError) return authError;

    await ensureDb();
    try {
        const { rows } = await client.execute('SELECT * FROM subscribers ORDER BY subscribed_at DESC');
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
    }
}

// DELETE — Admin: remove a subscriber
export async function DELETE(request) {
    const authError = requireAuth(request);
    if (authError) return authError;

    await ensureDb();
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        await client.execute({ sql: 'DELETE FROM subscribers WHERE id = ?', args: [id] });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete subscriber' }, { status: 500 });
    }
}
