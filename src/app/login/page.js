'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                router.push('/dashboard');
            } else {
                const data = await res.json();
                setError(data.error || 'Contraseña incorrecta.');
            }
        } catch (err) {
            setError('Error de conexión. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container animate-fade-in" style={{ padding: '160px 20px 80px', maxWidth: '450px', margin: '0 auto', minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ padding: '40px 30px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Panel del Promotor</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '0.95rem' }}>
                    Introduce tu contraseña para acceder al panel de gestión.
                </p>

                {error && (
                    <div style={{ background: 'rgba(255, 0, 0, 0.15)', padding: '12px', borderRadius: '8px', marginBottom: '20px', color: '#ff6b6b', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input
                        type="password"
                        placeholder="Contraseña"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoFocus
                        style={{
                            width: '100%',
                            padding: '14px',
                            borderRadius: '8px',
                            border: '1px solid var(--glass-border)',
                            background: 'rgba(0,0,0,0.3)',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none',
                            textAlign: 'center',
                            letterSpacing: '4px',
                        }}
                    />
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        style={{ padding: '14px', fontSize: '1rem', fontWeight: '600', width: '100%' }}
                    >
                        {loading ? 'Verificando...' : 'Acceder'}
                    </button>
                </form>
            </div>
        </div>
    );
}
