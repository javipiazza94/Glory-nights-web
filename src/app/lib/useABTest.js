/**
 * useABTest.js
 * ─────────────────────────────────────────────────────────────────
 * Hook para A/B testing del headline principal (H1) del hero.
 * Asigna una variante (A o B) al usuario usando localStorage
 * para que la experiencia sea consistente entre visitas.
 *
 * Registra impresiones y clics en CTA vinculados a cada variante
 * a través del sistema de analytics local.
 *
 * Ejemplo de uso:
 *   const { variant, headline, trackCTAClick } = useABTest();
 *   // variant = 'A' o 'B'
 *   // headline = texto del H1 asignado
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTrackEvent } from './useAnalytics';

// ── Variantes del test ────────────────────────────────────────
const VARIANTS = {
    A: {
        headline: 'Tributos a la luz\nde las velas',
        subline: 'Descubre conciertos mágicos en lugares espectaculares. Disfruta de la mejor música de cámara homenajeando a Los Beatles, Mecano, El Señor de los Anillos y Harry Potter.',
    },
    B: {
        headline: 'Conciertos que\niluminan tu alma',
        subline: 'Vive la música en su estado más puro. Tributos íntimos a la luz de las velas en los escenarios más espectaculares de Andalucía.',
    },
};

const AB_STORAGE_KEY = 'gn_ab_variant';

export function useABTest() {
    const [variant, setVariant] = useState('A');
    const [ready, setReady] = useState(false);
    const trackEvent = useTrackEvent();

    // Asignar variante al montar el componente
    useEffect(() => {
        let stored = null;
        try {
            stored = localStorage.getItem(AB_STORAGE_KEY);
        } catch { /* localStorage no disponible */ }

        if (stored === 'A' || stored === 'B') {
            setVariant(stored);
        } else {
            // Asignación aleatoria 50/50
            const newVariant = Math.random() < 0.5 ? 'A' : 'B';
            setVariant(newVariant);
            try {
                localStorage.setItem(AB_STORAGE_KEY, newVariant);
            } catch { /* sin localStorage */ }
        }
        setReady(true);
    }, []);

    // Registrar impresión de la variante (se ejecuta una vez)
    useEffect(() => {
        if (ready) {
            trackEvent('ab_impression', { variant, test: 'hero_headline' });
        }
    }, [ready, variant, trackEvent]);

    // Función para registrar clic en CTA vinculado a la variante
    const trackCTAClick = useCallback(() => {
        trackEvent('ab_cta_click', { variant, test: 'hero_headline' });
    }, [variant, trackEvent]);

    return {
        variant,
        headline: VARIANTS[variant].headline,
        subline: VARIANTS[variant].subline,
        trackCTAClick,
        ready,
    };
}
