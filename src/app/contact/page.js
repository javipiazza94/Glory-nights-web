/**
 * contact/page.js — Formulario de contacto inteligente
 * ─────────────────────────────────────────────────────────────────
 * Mejoras implementadas:
 *  - Persistencia del estado en localStorage (se restaura al refrescar)
 *  - Validación asíncrona del email
 *  - Honeypot anti-spam
 *  - Tracking de envíos vía analytics local
 */
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useTrackEvent } from '../lib/useAnalytics';

const STORAGE_KEY = 'gn_contact_form';

export default function ContactPage() {
    const trackEvent = useTrackEvent();

    // ── Estado del formulario con persistencia localStorage ──
    const [formData, setFormData] = useState({
        senderName: '',
        senderEmail: '',
        message: '',
        type: 'band',
        website: '' // honeypot — solo los bots rellenan esto
    });
    const [status, setStatus] = useState('');
    const [emailValid, setEmailValid] = useState(true);

    // Restaurar formulario desde localStorage al montar
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // No restaurar el honeypot por seguridad
                setFormData(prev => ({ ...prev, ...parsed, website: '' }));
            }
        } catch { /* localStorage no disponible */ }
    }, []);

    // Persistir cambios en localStorage (debounced implícito por React)
    useEffect(() => {
        try {
            const { website, ...dataToSave } = formData;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        } catch { /* sin localStorage */ }
    }, [formData]);

    // ── Validación asíncrona del email ──
    const validateEmail = useCallback((email) => {
        if (!email) { setEmailValid(true); return; }
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailValid(regex.test(email));
    }, []);

    const handleEmailChange = (e) => {
        const email = e.target.value;
        setFormData(prev => ({ ...prev, senderEmail: email }));
        // Validar con un pequeño delay para no interferir al escribir
        setTimeout(() => validateEmail(email), 500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!emailValid) return;
        setStatus('loading');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setStatus('success');
                setFormData({ senderName: '', senderEmail: '', message: '', type: 'band', website: '' });
                // Limpiar localStorage tras envío exitoso
                try { localStorage.removeItem(STORAGE_KEY); } catch {}
                // Tracking del evento
                trackEvent('form_submit', { form: 'contact', type: formData.type });
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    const inputBaseStyle = {
        width: '100%',
        padding: '14px',
        borderRadius: '8px',
        border: '1px solid var(--glass-border)',
        background: 'rgba(0,0,0,0.2)',
        color: 'white',
        outline: 'none',
        fontSize: '1rem',
        fontFamily: 'var(--font-montserrat), sans-serif',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    };

    return (
        <div className="container animate-fade-in" style={{ padding: '160px 20px 80px', maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '3rem', color: 'var(--accent)' }}>Contacto</h1>

            <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
                <p style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--text-secondary)' }}>
                    ¿Tienes un grupo tributo increíble o gestionas una sala de conciertos? ¡Hablemos!
                </p>

                {status === 'success' && (
                    <div style={{ background: 'rgba(102, 252, 241, 0.2)', padding: '15px', borderRadius: '10px', marginBottom: '20px', color: 'var(--accent)', textAlign: 'center' }}>
                        ¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.
                    </div>
                )}

                {status === 'error' && (
                    <div style={{ background: 'rgba(255, 0, 0, 0.2)', padding: '15px', borderRadius: '10px', marginBottom: '20px', color: '#ff6b6b', textAlign: 'center' }}>
                        Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Honeypot: invisible para humanos, los bots lo rellenan */}
                    <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
                        <label>Website</label>
                        <input
                            type="text"
                            name="website"
                            tabIndex={-1}
                            autoComplete="off"
                            value={formData.website}
                            onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Nombre</label>
                        <input
                            type="text"
                            required
                            value={formData.senderName}
                            onChange={(e) => setFormData(prev => ({ ...prev, senderName: e.target.value }))}
                            style={inputBaseStyle}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                        <input
                            type="email"
                            required
                            value={formData.senderEmail}
                            onChange={handleEmailChange}
                            style={{
                                ...inputBaseStyle,
                                borderColor: !emailValid ? '#ff6b6b' : 'var(--glass-border)',
                                boxShadow: !emailValid ? '0 0 0 2px rgba(255,107,107,0.2)' : 'none',
                            }}
                        />
                        {!emailValid && (
                            <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: '6px', fontFamily: 'var(--font-montserrat)' }}>
                                Por favor, introduce un email válido
                            </p>
                        )}
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Soy...</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                            style={inputBaseStyle}
                        >
                            <option value="band" style={{ background: '#1f2833' }}>Banda Tributo</option>
                            <option value="venue" style={{ background: '#1f2833' }}>Sala de Conciertos</option>
                            <option value="other" style={{ background: '#1f2833' }}>Otro</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Mensaje</label>
                        <textarea
                            required
                            rows="5"
                            value={formData.message}
                            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                            style={{ ...inputBaseStyle, resize: 'vertical' }}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={status === 'loading' || !emailValid}
                        style={{ marginTop: '10px' }}
                    >
                        {status === 'loading' ? 'Enviando...' : 'Enviar Mensaje'}
                    </button>

                    {/* Indicador de guardado automático */}
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', textAlign: 'center', margin: 0 }}>
                        💾 Tu formulario se guarda automáticamente
                    </p>
                </form>
            </div>
        </div>
    );
}
