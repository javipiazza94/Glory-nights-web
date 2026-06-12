'use client';

export default function ConcertModule({ concert }) {
    const concertDate = new Date(concert.date);
    const isPast = concertDate < new Date();

    const formattedDate = concertDate.toLocaleString('es-ES', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const isDirectVideo = (url) => {
        if (!url) return false;
        return url.toLowerCase().match(/\.(mp4|webm|ogg)$/) != null;
    };

    const handleShare = () => {
        const text = `¡Mira este concierto a la luz de las velas!\n🎵 Tributo a ${concert.bandName}\n📍 ${concert.venueName} (${concert.location})\n📆 ${concertDate.toLocaleDateString('es-ES')}`;
        const url = window.location.origin + '/conciertos';

        if (navigator.share) {
            navigator.share({
                title: 'Glory Nights Concierto',
                text: text,
                url: url
            }).catch(() => { });
        } else {
            window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n\nEntradas aquí: ' + url)}`, '_blank');
        }
    };

    const handleCalendar = () => {
        const startDate = new Date(concert.date);
        const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // assume 2 hours
        // Format for Google Calendar: YYYYMMDDTHHmmSSZ
        const formatGoogleDate = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');

        const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Tributo a ' + concert.bandName)}&dates=${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}&details=${encodeURIComponent('Concierto de Glory Nights a la luz de las velas.')}&location=${encodeURIComponent(concert.venueName + ', ' + concert.location)}`;
        window.open(gcalUrl, '_blank');
    };

    return (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'row', gap: '0', overflow: 'hidden', borderRadius: '8px', minHeight: '260px' }}>
            {/* ── LEFT: Media ── */}
            <div className="module-media" style={{ flex: '0 0 320px', minHeight: '260px', position: 'relative', overflow: 'hidden', background: '#111' }}>
                {isDirectVideo(concert.videoUrl) ? (
                    <video src={concert.videoUrl} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                ) : concert.bandImage ? (
                    <div style={{ backgroundImage: `url("${concert.bandImage}")`, backgroundSize: 'cover', backgroundPosition: 'center', width: '100%', height: '100%', position: 'absolute', inset: 0 }} />
                ) : concert.videoUrl ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '20px', textAlign: 'center' }}>
                        <a href={concert.videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>{concert.videoUrl.includes('instagram') ? 'Ver Reel en Instagram' : 'Ver Vídeo Externo'}</a>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Próximamente</div>
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 70%, var(--card-bg, #0b0c10) 100%)' }} />
            </div>

            {/* ── RIGHT: Info ── */}
            <div style={{ flex: 1, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                        <span style={{ color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>{formattedDate}</span>
                        <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.8rem', lineHeight: '1.2', margin: '5px 0 0', color: 'var(--accent)' }}>{concert.bandName}</h3>
                        <p style={{ color: 'var(--text-secondary)', margin: '5px 0 0', fontSize: '0.95rem' }}>📍 {concert.venueName} - {concert.location}</p>
                    </div>
                    <div>
                        {isPast ? (
                            <span style={{ display: 'inline-block', textAlign: 'center', color: 'var(--text-secondary)', padding: '8px 15px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'not-allowed', fontSize: '0.9rem' }}>
                                ✅ Celebrado
                            </span>
                        ) : concert.ticketUrl ? (
                            <a href={concert.ticketUrl} target="_blank" rel="noreferrer" className="btn-primary" style={{ padding: '8px 20px', display: 'inline-block', fontSize: '0.95rem' }}>
                                Entradas
                            </a>
                        ) : (
                            <span style={{ display: 'inline-block', textAlign: 'center', color: 'gray', fontStyle: 'italic', padding: '8px 15px', fontSize: '0.9rem' }}>Agotadas</span>
                        )}
                    </div>
                </div>

                {concert.description && <p style={{ margin: '10px 0 0', lineHeight: 1.6, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{concert.description}</p>}

                {/* ── Acciones de Interacción ── */}
                <div style={{ display: 'flex', gap: '20px', marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <button onClick={handleShare} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.9rem', padding: 0, fontWeight: '500' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                        Compartir
                    </button>
                    {!isPast && (
                        <button onClick={handleCalendar} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem', padding: 0, transition: 'color 0.2s', fontWeight: '500' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            Añadir al Calendario
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
