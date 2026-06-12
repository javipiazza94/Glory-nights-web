'use client';
import { useState } from 'react';

export default function NewsletterWidget() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [website, setWebsite] = useState(''); // honeypot
    const [status, setStatus] = useState('idle'); // idle | loading | success | error | duplicate

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name, website }),
            });
            if (res.status === 201) {
                setStatus('success');
                setEmail('');
                setName('');
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <section style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0b0c10 100%)',
            padding: '80px 20px',
            borderTop: '1px solid rgba(197, 160, 89, 0.2)',
            borderBottom: '1px solid rgba(197, 160, 89, 0.2)',
        }}>
            <div style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>

                {/* Candle icon */}
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🕯️</div>

                <p style={{
                    fontFamily: 'var(--font-montserrat), sans-serif',
                    fontSize: '0.8rem',
                    letterSpacing: '4px',
                    textTransform: 'uppercase',
                    color: '#C5A059',
                    marginBottom: '12px',
                }}>
                    No te pierdas nada
                </p>

                <h2 style={{
                    fontFamily: 'var(--font-playfair), serif',
                    fontSize: '2.4rem',
                    fontWeight: 700,
                    color: '#fff',
                    margin: '0 0 16px',
                    lineHeight: 1.2,
                }}>
                    Sé el primero en saberlo
                </h2>

                <p style={{
                    fontFamily: 'var(--font-montserrat), sans-serif',
                    color: 'rgba(255,255,255,0.65)',
                    fontSize: '1rem',
                    lineHeight: 1.8,
                    marginBottom: '40px',
                }}>
                    Nuevas fechas, nuevos artistas, nuevas ciudades.<br />
                    Entérate antes que nadie y elige el mejor sitio.
                </p>

                {status === 'success' ? (
                    <div style={{
                        background: 'rgba(197, 160, 89, 0.1)',
                        border: '1px solid rgba(197, 160, 89, 0.4)',
                        borderRadius: '10px',
                        padding: '28px 24px',
                    }}>
                        <p style={{ fontSize: '1.5rem', marginBottom: '8px' }}>✨</p>
                        <p style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.3rem', color: '#C5A059', margin: '0 0 8px' }}>
                            ¡Ya estás dentro!
                        </p>
                        <p style={{ fontFamily: 'var(--font-montserrat), sans-serif', color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem', margin: 0 }}>
                            Revisa tu bandeja de entrada para confirmar tu suscripción.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                        {/* Honeypot — hidden from humans */}
                        <input
                            type="text"
                            value={website}
                            onChange={e => setWebsite(e.target.value)}
                            style={{ display: 'none' }}
                            tabIndex={-1}
                            autoComplete="off"
                        />

                        <input
                            type="text"
                            placeholder="Tu nombre (opcional)"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            style={{
                                padding: '14px 20px',
                                borderRadius: '8px',
                                border: '1px solid rgba(197,160,89,0.3)',
                                background: 'rgba(255,255,255,0.06)',
                                color: '#fff',
                                fontFamily: 'var(--font-montserrat), sans-serif',
                                fontSize: '0.95rem',
                                outline: 'none',
                                width: '100%',
                                boxSizing: 'border-box',
                            }}
                        />

                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <input
                                type="email"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                style={{
                                    flex: 1,
                                    padding: '14px 20px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(197,160,89,0.3)',
                                    background: 'rgba(255,255,255,0.06)',
                                    color: '#fff',
                                    fontFamily: 'var(--font-montserrat), sans-serif',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    minWidth: '220px',
                                    boxSizing: 'border-box',
                                }}
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                style={{
                                    background: '#C5A059',
                                    color: '#0b0c10',
                                    border: 'none',
                                    padding: '14px 28px',
                                    borderRadius: '8px',
                                    fontFamily: 'var(--font-montserrat), sans-serif',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    letterSpacing: '1px',
                                    cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                                    opacity: status === 'loading' ? 0.7 : 1,
                                    transition: 'opacity 0.2s, transform 0.2s',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {status === 'loading' ? 'Enviando...' : 'Suscribirme'}
                            </button>
                        </div>

                        {status === 'error' && (
                            <p style={{ color: '#ff6b6b', fontSize: '0.9rem', fontFamily: 'var(--font-montserrat), sans-serif', margin: 0 }}>
                                Algo salió mal. Inténtalo de nuevo.
                            </p>
                        )}

                        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-montserrat), sans-serif', margin: '4px 0 0' }}>
                            Sin spam. Puedes cancelar en cualquier momento.
                        </p>
                    </form>
                )}
            </div>
        </section>
    );
}
