/**
 * SocialProof.js
 * ─────────────────────────────────────────────────────────────────
 * Banner de "Social Proof" dinámico que muestra un contador animado.
 * Al entrar en el viewport, los números se incrementan desde 0
 * hasta su valor final, creando un efecto visual atractivo.
 *
 * Los valores son configurables mediante la constante STATS.
 * Usa Framer Motion para la animación del contador.
 */
'use client';

import { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';

// ── Datos de Social Proof ──────────────────────────────────────
const STATS = [
    { value: 500, suffix: '+', label: 'Asistentes', icon: '🎭' },
    { value: 10, suffix: '+', label: 'Conciertos', icon: '🎵' },
    { value: 5, suffix: '+', label: 'Espacios únicos', icon: '🏛️' },
    { value: 98, suffix: '%', label: 'Satisfacción', icon: '⭐' },
];

/**
 * Hook que anima un número de 0 a `end` en `duration` ms.
 * Solo se activa cuando `trigger` es true.
 */
function useCountUp(end, trigger, duration = 1800) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!trigger) return;
        let startTime = null;
        let animFrame;

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Easing: ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) {
                animFrame = requestAnimationFrame(step);
            }
        };

        animFrame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(animFrame);
    }, [trigger, end, duration]);

    return count;
}

function StatItem({ value, suffix, label, icon, trigger, delay }) {
    const count = useCountUp(value, trigger, 1800 + delay);

    return (
        <div style={{
            textAlign: 'center',
            padding: '24px 16px',
            flex: '1 1 140px',
            minWidth: '140px',
        }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{icon}</div>
            <div style={{
                fontFamily: 'var(--font-playfair), serif',
                fontSize: '2.5rem',
                fontWeight: 700,
                color: '#C5A059',
                lineHeight: 1,
            }}>
                {count}{suffix}
            </div>
            <div style={{
                fontFamily: 'var(--font-montserrat), sans-serif',
                fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.6)',
                marginTop: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
            }}>
                {label}
            </div>
        </div>
    );
}

export default function SocialProof() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    return (
        <div
            ref={ref}
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '8px',
                padding: '40px 20px',
                background: 'linear-gradient(135deg, rgba(197,160,89,0.08) 0%, rgba(0,0,0,0.3) 100%)',
                borderTop: '1px solid rgba(197,160,89,0.15)',
                borderBottom: '1px solid rgba(197,160,89,0.15)',
            }}
        >
            {STATS.map((stat, i) => (
                <StatItem
                    key={stat.label}
                    {...stat}
                    trigger={isInView}
                    delay={i * 200} // escalonar las animaciones
                />
            ))}
        </div>
    );
}
