export default function VenueModule({ venue }) {
    const isDirectVideo = (url) => {
        if (!url) return false;
        return url.toLowerCase().match(/\.(mp4|webm|ogg)$/) != null;
    };

    return (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'row', gap: '0', overflow: 'hidden', borderRadius: '8px', minHeight: '240px' }}>

            {/* ── LEFT: Media ── */}
            <div style={{ flex: '0 0 320px', minHeight: '240px', position: 'relative', overflow: 'hidden', background: '#111' }}>
                {isDirectVideo(venue.videoUrl) ? (
                    <video
                        src={venue.videoUrl}
                        autoPlay muted loop playsInline
                        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
                    />
                ) : venue.imageUrl ? (
                    <div style={{ backgroundImage: `url("${venue.imageUrl}")`, backgroundSize: 'cover', backgroundPosition: 'center', width: '100%', height: '100%', position: 'absolute', inset: 0 }} />
                ) : venue.videoUrl ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '20px', textAlign: 'center' }}>
                        <a href={venue.videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
                            {venue.videoUrl.includes('instagram') ? 'Ver Reel en Instagram' : 'Ver Vídeo Externo'}
                        </a>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Un espacio mágico
                    </div>
                )}

                {/* Gradient overlay to blend into the right panel */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 70%, var(--card-bg, #0b0c10) 100%)' }} />
            </div>

            {/* ── RIGHT: Info ── */}
            <div style={{ flex: 1, padding: '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px', minWidth: 0 }}>
                <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.8rem', margin: 0, color: 'var(--accent)' }}>
                    {venue.name}
                </h3>

                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>
                    📍 {venue.location}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {venue.capacity && <span>👥 Capacidad: <strong style={{ color: 'white' }}>{venue.capacity}</strong></span>}
                    {venue.contactEmail && <span>✉️ {venue.contactEmail}</span>}
                </div>

                {venue.description && (
                    <p style={{ margin: 0, lineHeight: 1.7, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        {venue.description}
                    </p>
                )}
            </div>
        </div>
    );
}
