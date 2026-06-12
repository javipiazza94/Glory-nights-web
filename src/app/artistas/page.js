'use client';
import { useEffect, useState } from 'react';
import ArtistModule from '../components/ArtistModule';

export default function ArtistasPage() {
    const [bands, setBands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch('/api/bands')
            .then(res => res.json())
            .then(data => {
                setBands(data);
                setLoading(false);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, []);

    return (
        <div className="container animate-fade-in" style={{ padding: '160px 20px 40px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '3rem', color: 'var(--accent)' }}>Nuestros Artistas</h1>
            <p style={{ textAlign: 'center', marginBottom: '60px', color: 'var(--text-secondary)' }}>
                Los mejores tributos interpretados por músicos excepcionales.
            </p>

            {loading ? (
                <p style={{ textAlign: 'center' }}>Cargando artistas...</p>
            ) : error ? (
                <p style={{ textAlign: 'center', color: '#ff6b6b' }}>No se pudieron cargar los artistas. Inténtalo de nuevo más tarde.</p>
            ) : bands.length === 0 ? (
                <p style={{ textAlign: 'center' }}>Aún no hay artistas registrados.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                    {bands.map(band => (
                        <ArtistModule key={band.id} artist={band} />
                    ))}
                </div>
            )}
        </div>
    );
}
