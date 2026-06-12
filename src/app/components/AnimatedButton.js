/**
 * AnimatedButton.js
 * ─────────────────────────────────────────────────────────────────
 * Botón CTA con micro-interacciones: escala + brillo al hacer hover,
 * efecto "press" al hacer clic, todo usando Framer Motion.
 *
 * Acepta las mismas props que un <a> o <button>.
 * Si pasa `href`, renderiza un enlace; si no, un botón.
 *
 * Ejemplo de uso:
 *   <AnimatedButton href="/conciertos" className="btn-primary">
 *     Comprar entradas
 *   </AnimatedButton>
 */
'use client';

import { motion } from 'framer-motion';

export default function AnimatedButton({
    children,
    href,
    className = 'btn-primary',
    style = {},
    onClick,
    ...rest
}) {
    // Variantes de animación para hover y tap
    const motionProps = {
        whileHover: {
            scale: 1.05,
            boxShadow: '0 0 25px rgba(197, 160, 89, 0.4)',
            transition: { duration: 0.25 },
        },
        whileTap: {
            scale: 0.97,
            transition: { duration: 0.1 },
        },
    };

    // Si tiene href, renderiza un enlace animado
    if (href) {
        return (
            <motion.a
                href={href}
                className={className}
                style={style}
                onClick={onClick}
                {...motionProps}
                {...rest}
            >
                {children}
            </motion.a>
        );
    }

    // Si no, renderiza un botón animado
    return (
        <motion.button
            className={className}
            style={style}
            onClick={onClick}
            {...motionProps}
            {...rest}
        >
            {children}
        </motion.button>
    );
}
