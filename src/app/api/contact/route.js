import { NextResponse } from 'next/server';
import { client, ensureDb } from '../../../../database';
import { requireAuth } from '../../lib/auth';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const TYPE_LABELS = {
    band: 'Banda Tributo',
    venue: 'Sala de Conciertos',
    other: 'Otro',
};

/** Resolves subscriber_id from a senderEmail. Returns null if not found. */
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

export async function POST(request) {
    try {
        await ensureDb();
        const { senderName, senderEmail, message, type, website } = await request.json();

        // Honeypot check: if filled, it's a bot
        if (website) {
            return NextResponse.json({ success: true }, { status: 201 });
        }

        if (!senderName || !senderEmail || !message) {
            return NextResponse.json({ error: 'Todos los campos son obligatorios.' }, { status: 400 });
        }

        // 1. Auto-resolve subscriber link if senderEmail matches a subscriber
        const subscriber_id = await resolveSubscriberId(senderEmail);

        // 2. Save to database (always, regardless of email outcome)
        const result = await client.execute({
            sql: 'INSERT INTO messages (senderName, senderEmail, message, type, subscriber_id) VALUES (?, ?, ?, ?, ?)',
            args: [senderName, senderEmail, message, type, subscriber_id]
        });

        // 2. Send email notification if credentials are configured
        if (process.env.RESEND_API_KEY && process.env.PROMOTER_EMAIL) {
            try {
                const resend = new Resend(process.env.RESEND_API_KEY);
                await resend.emails.send({
                    from: 'Glory Nights <onboarding@resend.dev>', // TODO: change to notificaciones@tudominio.com when domain is verified
                    to: process.env.PROMOTER_EMAIL,
                    replyTo: senderEmail,
                    subject: `✉️ Nuevo mensaje de ${senderName} (${TYPE_LABELS[type] ?? type})`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0c10; color: #e0e0e0; padding: 32px; border-radius: 8px; border: 1px solid #C5A059;">
                            <h2 style="color: #C5A059; margin-top: 0;">Nuevo mensaje de contacto</h2>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 0; color: #999; width: 120px; vertical-align: top;">Nombre</td>
                                    <td style="padding: 8px 0; font-weight: bold;">${senderName}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #999; vertical-align: top;">Email</td>
                                    <td style="padding: 8px 0;"><a href="mailto:${senderEmail}" style="color: #C5A059;">${senderEmail}</a></td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #999; vertical-align: top;">Tipo</td>
                                    <td style="padding: 8px 0;">${TYPE_LABELS[type] ?? type}</td>
                                </tr>
                            </table>
                            <hr style="border: none; border-top: 1px solid #C5A05940; margin: 20px 0;" />
                            <h3 style="color: #C5A059; margin-top: 0;">Mensaje</h3>
                            <p style="line-height: 1.7; white-space: pre-wrap;">${message}</p>
                            <hr style="border: none; border-top: 1px solid #C5A05940; margin: 20px 0;" />
                            <p style="font-size: 0.8rem; color: #666;">Puedes gestionar todos los mensajes en el <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tu-web.vercel.app'}/dashboard" style="color: #C5A059;">Panel del Promotor</a>.</p>
                        </div>
                    `,
                });
            } catch (emailError) {
                // Email failure is non-critical — log it but don't fail the request
                console.error('Email notification failed:', emailError);
            }
        }

        return NextResponse.json({ id: result.lastInsertRowid?.toString(), success: true }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}

export async function GET() {
    await ensureDb();
    try {
        const { rows } = await client.execute(`
            SELECT m.*,
                   s.email AS subscriber_email,
                   s.name  AS subscriber_name
            FROM messages m
            LEFT JOIN subscribers s ON m.subscriber_id = s.id
            ORDER BY m.created_at DESC
        `);
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}

export async function DELETE(request) {
    const authError = requireAuth(request);
    if (authError) return authError;

    try {
        await ensureDb();
        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        await client.execute({
            sql: 'DELETE FROM messages WHERE id = ?',
            args: [id]
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
    }
}
