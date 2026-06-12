/**
 * AnimatedSection.js
 * ─────────────────────────────────────────────────────────────────
 * Componente wrapper que aplica una animación de "scroll-reveal"
 * (fade-in + slide-up) cuando el elemento entra en el viewport.
 *
 * Usa Framer Motion `useInView` + `motion.div`.
 * Se puede personalizar delay, duración y dirección.
 *
 * Ejemplo de uso:
 *   <AnimatedSection>
 *     <h2>Mi Sección</h2>
 *   </AnimatedSection>
 */
'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function AnimatedSection({
    children,
    className = '',
    style = {},
    delay = 0,          // retraso en segundos antes de animar
    duration = 0.7,     // duración de la animación en segundos
    direction = 'up',   // 'up' | 'down' | 'left' | 'right'
    once = true,        // si true, anima solo la primera vez
    amount = 0.2,       // porcentaje del elemento visible para disparar
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, amount });

    // Calcular el desplazamiento inicial según la dirección
    const offsets = {
        up:    { x: 0, y: 40 },
        down:  { x: 0, y: -40 },
        left:  { x: 40, y: 0 },
        right: { x: -40, y: 0 },
    };
    const { x, y } = offsets[direction] || offsets.up;

    return (
        <motion.div
            ref={ref}
            className={className}
            style={style}
            initial={{ opacity: 0, x, y }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x, y }}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94], // ease-out suave
            }}
        >
            {children}
        </motion.div>
    );
}
