/**
 * NavBar.js
 * ─────────────────────────────────────────────────────────────────
 * Barra de navegación sticky con efecto glassmorphism.
 * Al hacer scroll, el fondo se vuelve más opaco y se aplica blur.
 * Incluye menú hamburguesa responsive para móviles.
 *
 * La clase `navbar--scrolled` se añade dinámicamente cuando el
 * usuario baja más de 50px, activando la transición visual.
 */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function NavBar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Detectar scroll para aplicar efecto glassmorphism
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Cerrar menú con tecla ESC
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') setOpen(false); };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, []);

    // Prevenir scroll del body cuando el menú móvil está abierto
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    return (
        <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
            {/* Logo optimizado con next/image */}
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <Image
                    src="/img/GLORY NIGHTS LOGO.jpeg"
                    alt="Glory Nights"
                    width={180}
                    height={90}
                    className="navbar-logo-img"
                    priority /* Cargar logo sin lazy-load para LCP */
                />
            </Link>

            {/* Desktop links */}
            <div className="nav-links">
                <Link href="/conciertos">Conciertos</Link>
                <Link href="/artistas">Artistas</Link>
                <Link href="/venues">Espacios</Link>
                <Link href="/sobre-nosotros">Sobre Nosotros</Link>
                <Link href="/contact">Contacto</Link>
            </div>

            {/* Hamburger button (mobile only) */}
            <button
                className={`nav-hamburger${open ? ' is-open' : ''}`}
                aria-label="Abrir menú"
                aria-expanded={open}
                onClick={() => setOpen(!open)}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* Mobile overlay menu */}
            <div className={`nav-mobile-menu${open ? ' is-open' : ''}`} onClick={() => setOpen(false)}>
                <div className="nav-mobile-links" onClick={(e) => e.stopPropagation()}>
                    <Link href="/conciertos" onClick={() => setOpen(false)}>Conciertos</Link>
                    <Link href="/artistas" onClick={() => setOpen(false)}>Artistas</Link>
                    <Link href="/venues" onClick={() => setOpen(false)}>Espacios</Link>
                    <Link href="/sobre-nosotros" onClick={() => setOpen(false)}>Sobre Nosotros</Link>
                    <Link href="/contact" onClick={() => setOpen(false)}>Contacto</Link>
                </div>
            </div>
        </nav>
    );
}
