/**
 * useAnalytics.js
 * ─────────────────────────────────────────────────────────────────
 * Hook personalizado para tracking de eventos SIN cookies de terceros.
 * Los eventos se envían a nuestro propio endpoint /api/analytics
 * y se almacenan en la base de datos local (SQLite/Turso).
 *
 * Ejemplo de uso:
 *   const trackEvent = useTrackEvent();
 *   trackEvent('cta_click', { button: 'hero_comprar' });
 *
 * Eventos sugeridos:
 *   - page_view      → cada carga de página
 *   - cta_click      → clic en botón de acción
 *   - newsletter_sub → suscripción al newsletter
 *   - form_submit    → envío de formulario de contacto
 *   - ab_impression  → impresión de variante A/B
 */
'use client';

import { useCallback } from 'react';

/**
 * Devuelve una función `trackEvent(eventName, metadata)`
 * que envía un evento al endpoint de analytics.
 * Se ejecuta en modo "fire-and-forget" (no bloquea la UI).
 */
export function useTrackEvent() {
    const trackEvent = useCallback((eventName, metadata = {}) => {
        // Fire-and-forget: no esperamos la respuesta
        // para no afectar al rendimiento de la página
        try {
            fetch('/api/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event: eventName,
                    metadata,
                    url: window.location.pathname,
                    referrer: document.referrer || null,
                    timestamp: new Date().toISOString(),
                }),
            }).catch(() => {
                // Silenciar errores de analytics para no afectar la UX
            });
        } catch {
            // Silenciar cualquier error
        }
    }, []);

    return trackEvent;
}
