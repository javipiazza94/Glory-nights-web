/**
 * HeroClient.js
 * ─────────────────────────────────────────────────────────────────
 * Componente client-side del hero principal.
 * Gestiona el A/B testing del headline y las animaciones de
 * entrada del contenido del hero.
 *
 * Se separa del page.js (server component) porque necesita
 * hooks de React (useState, useEffect) y Framer Motion.
 */
'use client';

import { motion } from 'framer-motion';
import AnimatedButton from './AnimatedButton';
import { useABTest } from '../lib/useABTest';

export default function HeroClient() {
    const { headline, subline, trackCTAClick, ready } = useABTest();

    return (
        <div className="hero-content">
            <div className="candle-glow"></div>

            <motion.p
                className="hero-kicker"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                Una experiencia musical inmersiva
            </motion.p>

            {/* H1 con A/B testing: muestra la variante asignada */}
            <motion.h1
                className="hero-title"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 30 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                dangerouslySetInnerHTML={{
                    __html: headline.replace('\n', '<br />')
                }}
            />

            <motion.p
                className="hero-subtitle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
            >
                {subline}
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
            >
                <AnimatedButton
                    href="/conciertos"
                    className="btn-primary"
                    style={{ marginTop: '40px' }}
                    onClick={trackCTAClick}
                >
                    Comprar entradas
                </AnimatedButton>
            </motion.div>
        </div>
    );
}
