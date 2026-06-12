'use client';
import { useEffect, useState } from 'react';
import VenueModule from '../components/VenueModule';

export default function VenuesPage() {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch('/api/venues')
            .then(res => res.json())
            .then(data => {
                setVenues(data);
                setLoading(false);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, []);

    return (
        <div className="container animate-fade-in" style={{ padding: '160px 20px 40px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '3rem', color: 'var(--accent)' }}>Espacios Únicos</h1>
            <p style={{ textAlign: 'center', marginBottom: '60px', color: 'var(--text-secondary)' }}>
                Lugares mágicos elegidos especialmente para envolverte de la atmósfera de Glory Nights.
            </p>

            {loading ? (
                <p style={{ textAlign: 'center' }}>Cargando espacios...</p>
            ) : error ? (
                <p style={{ textAlign: 'center', color: '#ff6b6b' }}>No se pudieron cargar los espacios. Inténtalo de nuevo más tarde.</p>
            ) : venues.length === 0 ? (
                <p style={{ textAlign: 'center' }}>Aún no hay salas registradas.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                    {venues.map(venue => (
                        <VenueModule key={venue.id} venue={venue} />
                    ))}
                </div>
            )}
        </div>
    );
}
