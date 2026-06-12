'use client';
import { useEffect, useState } from 'react';
import ConcertModule from '../components/ConcertModule';

export default function ConciertosPage() {
    const [concerts, setConcerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [selectedCity, setSelectedCity] = useState('Todas');

    useEffect(() => {
        fetch('/api/concerts')
            .then(res => res.json())
            .then(data => {
                setConcerts(data);
                setLoading(false);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, []);

    const now = new Date();

    // Filtramos conciertos futuros y pasados
    const upcomingConcerts = concerts.filter(c => new Date(c.date) >= now);

    // Los pasados los ordenamos de más reciente a más antiguo
    const pastConcerts = concerts
        .filter(c => new Date(c.date) < now)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Determinar qué lista mostrar según la solapa
    let displayConcerts = activeTab === 'upcoming' ? upcomingConcerts : pastConcerts;

    // Filtrar por ciudad si no es "Todas"
    if (selectedCity !== 'Todas') {
        displayConcerts = displayConcerts.filter(c => c.location === selectedCity);
    }

    // Extraer ciudades únicas para el filtro
    const uniqueCities = ['Todas', ...new Set(concerts.map(c => c.location).filter(Boolean))].sort();

    return (
        <div className="container animate-fade-in" style={{ padding: '160px 20px 40px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '3.5rem', color: 'var(--accent)' }}>Cartelera</h1>
            <p style={{ textAlign: 'center', marginBottom: '40px', color: 'var(--text-secondary)' }}>
                Vive la música en su estado más puro bajo la mágica luz de las velas.
            </p>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', justifyContent: 'center' }}>
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className="btn-primary"
                    style={{
                        background: activeTab === 'upcoming' ? 'var(--accent)' : 'transparent',
                        color: activeTab === 'upcoming' ? '#0b0c10' : 'var(--accent)',
                        padding: '8px 25px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        fontStyle: 'normal'
                    }}
                >
                    Próximos Conciertos
                </button>
                <button
                    onClick={() => setActiveTab('past')}
                    className="btn-primary"
                    style={{
                        background: activeTab === 'past' ? 'var(--accent)' : 'transparent',
                        color: activeTab === 'past' ? '#0b0c10' : 'var(--accent)',
                        padding: '8px 25px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        fontStyle: 'normal'
                    }}
                >
                    Conciertos Pasados
                </button>
            </div>

            {/* Filtro de Ciudades */}
            {uniqueCities.length > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px', alignItems: 'center', gap: '15px' }}>
                    <label htmlFor="city-filter" style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>
                        Filtrar por ciudad:
                    </label>
                    <div style={{ position: 'relative' }}>
                        <select
                            id="city-filter"
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            style={{
                                appearance: 'none',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'var(--text-main)',
                                border: '1px solid rgba(197, 160, 89, 0.3)',
                                borderRadius: '5px',
                                padding: '10px 40px 10px 15px',
                                fontSize: '1rem',
                                outline: 'none',
                                cursor: 'pointer',
                                transition: 'border-color 0.3s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(197, 160, 89, 0.3)'}
                        >
                            {uniqueCities.map(city => (
                                <option key={city} value={city} style={{ background: '#0b0c10', color: 'var(--text-main)' }}>
                                    {city}
                                </option>
                            ))}
                        </select>
                        <span style={{
                            position: 'absolute',
                            right: '15px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            pointerEvents: 'none',
                            color: 'var(--accent)',
                            fontSize: '0.8rem'
                        }}>
                            ▼
                        </span>
                    </div>
                </div>
            )}

            {loading ? (
                <p style={{ textAlign: 'center' }}>Cargando conciertos...</p>
            ) : error ? (
                <p style={{ textAlign: 'center', color: '#ff6b6b' }}>No se pudieron cargar los conciertos. Inténtalo de nuevo más tarde.</p>
            ) : displayConcerts.length === 0 ? (
                <p style={{ textAlign: 'center' }}>
                    {activeTab === 'upcoming' ? 'No hay conciertos programados por ahora.' : 'Aún no hay conciertos pasados.'}
                </p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                    {displayConcerts.map(concert => (
                        <ConcertModule key={concert.id} concert={concert} />
                    ))}
                </div>
            )}
        </div>
    );
}
