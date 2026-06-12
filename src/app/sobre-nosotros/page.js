import Link from 'next/link';
import Image from 'next/image';

// ─────────────────────────────────────────────
// DATA — Edit this to customise the page
// ─────────────────────────────────────────────

const COMPANY = {
    name: 'Glory Nights',
    tagline: 'La magia de la música a la luz de las velas',
    description: `Glory Nights nació de una pasión compartida: reunir a personas alrededor de la música en vivo en espacios únicos e íntimos, donde cada nota cobra vida bajo el cálido resplandor de cientos de velas.\n\nFundada en 2025, nuestra promotora ha producido más de 10 conciertos tributo en escenarios espectaculares Sevilla y Cádiz, acercando la magia de Los Beatles, Queen, Mecano, Harry Potter, El Señor de los Anillos y muchos otros artistas a miles de espectadores que buscan una experiencia musical diferente.`,
    heroImage: '/img/concierto2.jpeg',
    videoUrl: '/img/concierto9.mp4', // Set to an .mp4 URL or null to hide
    stats: [
        { number: '10+', label: 'Conciertos producidos' },
        { number: '1.000+', label: 'Asistentes' },
        { number: '5+', label: 'Espacios únicos' },
        { number: '10+', label: 'Artistas colaboradores' },
    ],
};

const TEAM = [
    {
        name: 'Manuel Puente Piazza',
        role: 'Fundador & Director Artístico',
        bio: 'Apasionado de la música desde pequeño, Manuel ha dedicado su carrera a crear experiencias musicales únicas que conecten a las personas con las grandes obras de la historia de la música.',
        imageUrl: '/img/GLORY NIGHTS LOGO.jpeg',
        instagram: null,
    },
    // Add more team members here following the same structure
];

const VALUES = [
    { icon: '🕯️', title: 'Atmósfera', text: 'Cada detalle del escenario está pensado para crear una experiencia sensorial completa e inmersiva.' },
    { icon: '🎶', title: 'Calidad Musical', text: 'Trabajamos únicamente con músicos excepcionales que rindan el máximo homenaje a los artistas originales.' },
    { icon: '🏛️', title: 'Espacios Únicos', text: 'Seleccionamos cuidadosamente localizaciones con historia y carácter que complementen la música.' },
];

// ─────────────────────────────────────────────
// HELPER: renders either a <video> or an <img>
// ─────────────────────────────────────────────
function MediaBlock({ src, alt, style = {}, controls = false }) {
    if (!src) return null;
    const isVideo = src.match(/\.(mp4|webm|ogg)$/i);
    const baseStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
        ...style,
    };
    if (isVideo) {
        if (controls) {
            return (
                <video controls style={{ ...baseStyle, objectFit: 'contain' }}>
                    <source src={src} />
                </video>
            );
        }
        return (
            <video autoPlay muted loop playsInline preload="none" style={baseStyle}>
                <source src={src} />
            </video>
        );
    }
    // Usar next/image dentro de un contenedor relativo para `fill`
    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image
                src={src}
                alt={alt || ''}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                style={{ objectFit: style.objectFit || 'cover' }}
            />
        </div>
    );
}

// ─────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────
export default function SobreNosotrosPage() {
    return (
        <div className="animate-fade-in" style={{ paddingBottom: '80px', paddingTop: '120px' }}>

            {/* ── HERO ── */}
            <section style={{ position: 'relative', height: '65vh', minHeight: '420px', overflow: 'hidden' }}>
                {COMPANY.heroImage && (
                    <Image
                        src={COMPANY.heroImage}
                        alt="Glory Nights"
                        fill
                        priority
                        sizes="100vw"
                        style={{ objectFit: 'cover' }}
                    />
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.82) 100%)' }} />
                <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '0 20px' }}>
                    <p style={{ fontFamily: 'var(--font-montserrat)', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.85rem', color: 'var(--accent-dark)', marginBottom: '16px' }}>
                        Nuestra historia
                    </p>
                    <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700, lineHeight: 1.1, color: '#fff', marginBottom: '20px' }}>
                        {COMPANY.name}
                    </h1>
                    <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.8)', maxWidth: '540px', lineHeight: 1.7 }}>
                        {COMPANY.tagline}
                    </p>
                </div>
            </section>

            {/* ── ABOUT STORY ── */}
            <section style={{ maxWidth: '820px', margin: '0 auto', padding: '70px 24px 0' }}>
                <div style={{ display: 'grid', gap: '50px' }}>
                    {COMPANY.description.split('\n\n').map((para, i) => (
                        <p key={i} style={{ fontSize: '1.1rem', lineHeight: 1.9, color: 'var(--text-secondary)', fontWeight: 300, borderLeft: i === 0 ? '3px solid var(--accent)' : 'none', paddingLeft: i === 0 ? '24px' : 0 }}>
                            {para}
                        </p>
                    ))}
                </div>
            </section>

            {/* ── STATS ── */}
            <section style={{ maxWidth: '960px', margin: '70px auto 0', padding: '0 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2px', background: 'var(--glass-border)', borderRadius: '8px', overflow: 'hidden' }}>
                    {COMPANY.stats.map((s) => (
                        <div key={s.label} style={{ background: 'var(--card-bg)', padding: '36px 20px', textAlign: 'center' }}>
                            <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '2.8rem', fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}>
                                {s.number}
                            </div>
                            <div style={{ marginTop: '10px', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── VIDEO (optional) ── */}
            {COMPANY.videoUrl && (
                <section style={{ maxWidth: '1000px', margin: '70px auto 0', padding: '0 24px' }}>
                    <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', aspectRatio: '16/9', background: '#000' }}>
                        <MediaBlock src={COMPANY.videoUrl} alt="Glory Nights en acción" controls={true} />
                    </div>
                </section>
            )}

            {/* ── VALUES ── */}
            <section style={{ maxWidth: '960px', margin: '80px auto 0', padding: '0 24px' }}>
                <h2 style={{ fontFamily: 'var(--font-playfair)', textAlign: 'center', fontSize: '2.2rem', color: 'var(--accent)', marginBottom: '10px' }}>
                    Lo que nos define
                </h2>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '50px' }}>
                    Los principios que guían cada concierto que producimos
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                    {VALUES.map((v) => (
                        <div key={v.title} className="glass-panel" style={{ padding: '32px 28px' }}>
                            <div style={{ fontSize: '2.2rem', marginBottom: '16px' }}>{v.icon}</div>
                            <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.3rem', color: 'var(--accent)', marginBottom: '12px' }}>
                                {v.title}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>{v.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── TEAM ── */}
            {TEAM.length > 0 && (
                <section style={{ maxWidth: '960px', margin: '80px auto 0', padding: '0 24px' }}>
                    <h2 style={{ fontFamily: 'var(--font-playfair)', textAlign: 'center', fontSize: '2.2rem', color: 'var(--accent)', marginBottom: '10px' }}>
                        Nuestro Equipo
                    </h2>
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '50px' }}>
                        Las personas detrás de la magia
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '30px' }}>
                        {TEAM.map((member) => (
                            <div key={member.name} className="glass-panel" style={{ overflow: 'hidden', borderRadius: '8px' }}>
                                {/* Photo */}
                                <div style={{ aspectRatio: '1/1', overflow: 'hidden', background: '#111', position: 'relative' }}>
                                    <MediaBlock src={member.imageUrl} alt={member.name} />
                                </div>
                                {/* Info */}
                                <div style={{ padding: '28px 24px' }}>
                                    <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.4rem', color: 'var(--accent)', marginBottom: '4px' }}>
                                        {member.name}
                                    </h3>
                                    <p style={{ fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent-dark)', marginBottom: '16px' }}>
                                        {member.role}
                                    </p>
                                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>{member.bio}</p>
                                    {member.instagram && (
                                        <a href={member.instagram} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '16px', color: 'var(--accent)', fontSize: '0.85rem' }}>
                                            Instagram →
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ── CTA ── */}
            <section style={{ textAlign: 'center', padding: '80px 24px 0' }}>
                <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '2rem', color: 'var(--accent)', marginBottom: '16px' }}>
                    ¿Quieres colaborar con nosotros?
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
                    Si tienes una sala, eres músico o simplemente quieres saber más, nos encantaría escucharte.
                </p>
                <Link href="/contact" className="btn-primary" style={{ padding: '14px 36px', fontSize: '1rem' }}>
                    Contactar
                </Link>
            </section>

        </div>
    );
}
