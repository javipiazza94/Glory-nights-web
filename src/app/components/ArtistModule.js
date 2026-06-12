export default function ArtistModule({ artist }) {
    const isDirectVideo = (url) => {
        if (!url) return false;
        return url.toLowerCase().match(/\.(mp4|webm|ogg)$/) != null;
    };

    return (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'row', gap: '0', overflow: 'hidden', borderRadius: '8px', minHeight: '240px' }}>
            {/* ── LEFT: Media ── */}
            <div className="module-media" style={{ flex: '0 0 320px', minHeight: '240px', position: 'relative', overflow: 'hidden', background: '#111' }}>
                {isDirectVideo(artist.videoUrl) ? (
                    <video src={artist.videoUrl} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                ) : artist.imageUrl ? (
                    <div style={{ backgroundImage: `url("${artist.imageUrl}")`, backgroundSize: 'cover', backgroundPosition: 'center', width: '100%', height: '100%', position: 'absolute', inset: 0 }} />
                ) : artist.videoUrl ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '20px', textAlign: 'center' }}>
                        <a href={artist.videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>{artist.videoUrl.includes('instagram') ? 'Ver Reel en Instagram' : 'Ver Vídeo Externo'}</a>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Descubre la magia</div>
                )}
                {/* Gradient overlay to blend into the right panel */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 70%, var(--card-bg, #0b0c10) 100%)' }} />
            </div>

            {/* ── RIGHT: Info ── */}
            <div style={{ flex: 1, padding: '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px', minWidth: 0 }}>
                <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.8rem', margin: '0', color: 'var(--accent)' }}>{artist.name}</h3>
                <h4 style={{ color: 'var(--text-main)', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px', margin: '0' }}>Tributo a {artist.tributeTo}</h4>
                {artist.description && <p style={{ margin: 0, lineHeight: 1.7, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{artist.description}</p>}
            </div>
        </div>
    );
}
