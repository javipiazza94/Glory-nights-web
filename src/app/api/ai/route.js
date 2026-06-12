/**
 * /api/ai — AI Conversational Assistant (Backend Placeholder)
 * ─────────────────────────────────────────────────────────────────
 * ⚠️  PLACEHOLDER — Este endpoint es la estructura preparada para
 * integrar un asistente conversacional con IA (estilo Vercel AI SDK)
 * que use RAG (Retrieval-Augmented Generation) con el contexto
 * de los servicios de Glory Nights.
 *
 * ESTADO ACTUAL: Devuelve una respuesta estática explicando que
 * el servicio no está activo todavía. NO afecta al frontend ni
 * a ningún componente visible de la web.
 *
 * PARA ACTIVAR EN EL FUTURO:
 * 1. Instalar dependencias: `npm install ai @ai-sdk/openai`
 * 2. Configurar OPENAI_API_KEY en .env
 * 3. Implementar embeddings de los servicios de Glory Nights
 * 4. Crear componente FloatingAssistant en el frontend
 * 5. Conectar este endpoint con el SDK de Vercel AI
 *
 * Estructura esperada del request:
 *   POST /api/ai
 *   { "messages": [{ "role": "user", "content": "¿Qué conciertos hay?" }] }
 *
 * Estructura esperada del response (cuando esté activo):
 *   Streaming de texto via ReadableStream (SSE)
 */
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// ── Contexto RAG: datos de la empresa para el asistente ──────
// Cuando se implemente, estos datos se convertirán en embeddings
// y se almacenarán en una base de datos vectorial.
const GLORY_NIGHTS_CONTEXT = {
    company: 'Glory Nights',
    description: 'Promotora de conciertos tributo a la luz de las velas en Andalucía',
    services: [
        'Conciertos tributo a la luz de las velas',
        'Eventos privados en espacios únicos',
        'Tributos a Los Beatles, Mecano, Harry Potter, El Señor de los Anillos',
    ],
    locations: ['Sevilla', 'Cádiz', 'Sanlúcar de Barrameda', 'Alcalá de Guadaira'],
    contact: 'info@glorynightsconcerts.com',
    website: 'https://glorynightsconcerts.com',
};

export async function POST(request) {
    // ── PLACEHOLDER: devolver respuesta estática ──────────────
    // Cuando se integre el LLM, este bloque se reemplazará por:
    //
    // const { messages } = await request.json();
    // const result = await streamText({
    //     model: openai('gpt-4o-mini'),
    //     system: `Eres el asistente de ${GLORY_NIGHTS_CONTEXT.company}...`,
    //     messages,
    // });
    // return result.toDataStreamResponse();

    return NextResponse.json({
        active: false,
        message: 'El asistente AI no está activo en este momento. Contacta con info@glorynightsconcerts.com para cualquier consulta.',
        context: GLORY_NIGHTS_CONTEXT,
        setup_instructions: 'Ver comentarios en este archivo para instrucciones de activación.',
    }, { status: 200 });
}

export async function GET() {
    return NextResponse.json({
        status: 'placeholder',
        message: 'AI assistant endpoint — not yet active',
        ready: false,
    });
}
