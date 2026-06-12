/**
 * page.js — Página principal de Glory Nights
 * ─────────────────────────────────────────────────────────────────
 * Incluye las siguientes mejoras:
 *  - next/image para todas las imágenes (WebP/AVIF automático)
 *  - AnimatedSection para scroll-reveal en cada bloque
 *  - AnimatedButton para CTAs con micro-interacciones
 *  - SocialProof con contadores animados
 *  - Galería Bento Grid responsiva
 *  - A/B testing del headline principal
 *  - Video con preload="none" para reducir LCP
 *  - Componente HeroClient para la parte interactiva (A/B + animaciones)
 */
import Image from 'next/image';
import NewsletterWidget from './components/NewsletterWidget';
import AnimatedSection from './components/AnimatedSection';
import AnimatedButton from './components/AnimatedButton';
import SocialProof from './components/SocialProof';
import JsonLd from './components/JsonLd';
import HeroClient from './components/HeroClient';
import LinkToMain from './components/LinkToMain';
import './home.css';

// ── Reseñas de respaldo (se usan si la API no responde) ──
const FALLBACK_REVIEWS = [
  { id: 'f1', author: 'María L. (Tributo a Mecano)', text: '"Una experiencia absolutamente inolvidable. La atmósfera íntima y la música perfecta hicieron una noche mágica."', stars: 5 },
  { id: 'f2', author: 'Carlos G. (El Señor de los Anillos)', text: '"Me transporté directamente a la Tierra Media. El cuarteto de cuerdas fue espectacular y el lugar era precioso."', stars: 5 },
  { id: 'f3', author: 'Laura S. (Harry Potter)', text: '"El ambiente a la luz de las velas le da un toque muy especial a la banda sonora de Harry Potter. ¡Repetiré seguro!"', stars: 5 },
];

// ── JSON-LD para la landing page (WebSite + Event schema) ──
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Glory Nights',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://glorynightsconcerts.com',
  description: 'Promotora de conciertos tributo a la luz de las velas en Andalucía.',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://glorynightsconcerts.com'}/conciertos`,
    'query-input': 'required name=search_term_string',
  },
};

export default async function Home() {
  // ── Fetch de reseñas en el servidor ──
  let reviews = [];
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/reviews`, { cache: 'no-store' });
    if (res.ok) reviews = await res.json();
  } catch { /* usar fallback */ }
  if (!Array.isArray(reviews) || reviews.length === 0) reviews = FALLBACK_REVIEWS;

  return (
    <div className="home-container">
      <JsonLd data={websiteSchema} />

      {/* ══════════════════════════════════════════════════════════
          HERO — Con A/B testing del headline (componente client)
          ══════════════════════════════════════════════════════════ */}
      <header className="hero">
        {/* Imagen hero optimizada con next/image */}
        <Image
          src="/img/concierto5.jpeg"
          alt="Concierto a la luz de las velas"
          fill
          priority /* Prioridad máxima para LCP */
          sizes="100vw"
          style={{ objectFit: 'cover' }}
          quality={75}
          className="hero-bg-image"
        />
        <div className="hero-overlay"></div>
        <HeroClient />
      </header>

      {/* ══════════════════════════════════════════════════════════
          CARTELERA DESTACADA
          ══════════════════════════════════════════════════════════ */}
      <AnimatedSection>
        <section className="featured-section">
          <div className="section-header text-center">
            <h2>Cartelera Destacada</h2>
            <p>Los homenajes más esperados en un ambiente íntimo y espectacular</p>
          </div>

          <div className="bands-grid">
            {/* Card 1 */}
            <div className="band-card">
              <div className="band-img-wrapper">
                <div className="band-img-placeholder" style={{ position: 'relative' }}>
                  <Image
                    src="/img/conciertos-de-verano.jpg"
                    alt="Conciertos de verano Glory Nights"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="date-badge">JUL 25</div>
                </div>
              </div>
              <div className="band-info">
                <span className="category">Pop / Clásico</span>
                <h3>Conciertos de verano</h3>
                <p className="location">📍 Bodegas Hidaldo: LA GITANA, Sanlúcar de Barrameda</p>
                <div className="card-footer">
                  <span className="price">Desde 25,00 €</span>
                  <span className="tickets-link">Ver entradas →</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="band-card">
              <div className="band-img-wrapper">
                <div className="band-img-placeholder" style={{ position: 'relative' }}>
                  <Image
                    src="/img/glory-nightsharry-potter--el-senor-de-los-anillos.jpg"
                    alt="El Señor de los Anillos bajo las Estrellas"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="date-badge">20 FEB</div>
                </div>
              </div>
              <div className="band-info">
                <span className="category">Bandas Sonoras</span>
                <h3>El Señor de los Anillos bajo las Estrellas</h3>
                <p className="location">📍 Teatro Gutiérrez de Alba, Alcalá de Guadaira</p>
                <div className="card-footer">
                  <span className="price">Desde 25,00 €</span>
                  <span className="tickets-link">Ver entradas →</span>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="band-card">
              <div className="band-img-wrapper">
                <div className="band-img-placeholder" style={{ position: 'relative' }}>
                  <Image
                    src="/img/harry-poter.jpeg"
                    alt="La Magia de Harry Potter en Concierto"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="date-badge">20 FEB</div>
                </div>
              </div>
              <div className="band-info">
                <span className="category">Bandas Sonoras</span>
                <h3>La Magia de Harry Potter en Concierto</h3>
                <p className="location">📍 Teatro Gutiérrez de Alba, Alcalá de Guadaira</p>
                <div className="card-footer">
                  <span className="price">Desde 15,00 €</span>
                  <span className="tickets-link">Ver entradas →</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ══════════════════════════════════════════════════════════
          SOCIAL PROOF — Contadores animados
          ══════════════════════════════════════════════════════════ */}
      <SocialProof />

      {/* ══════════════════════════════════════════════════════════
          RESEÑAS
          ══════════════════════════════════════════════════════════ */}
      <AnimatedSection delay={0.1}>
        <section className="reviews-section">
          <div className="section-header text-center">
            <h2>Lo que dicen nuestros asistentes</h2>
            <p>La magia de Glory Nights a través de sus experiencias</p>
          </div>
          <div className="reviews-grid">
            {reviews.map(r => (
              <div className="review-card" key={r.id}>
                <div className="review-stars">{'★'.repeat(r.stars || 5)}{'☆'.repeat(5 - (r.stars || 5))}</div>
                <p className="review-text">{r.text}</p>
                <p className="review-author">— {r.author}{r.concert_label ? ` (${r.concert_label})` : ''}</p>
              </div>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* ══════════════════════════════════════════════════════════
          GALERÍA BENTO GRID
          ══════════════════════════════════════════════════════════ */}
      <AnimatedSection delay={0.15}>
        <section className="gallery-section">
          <div className="section-header text-center">
            <h2>Galería</h2>
            <p>Instantes mágicos capturados a la luz de las velas</p>
          </div>
          <div className="bento-grid">
            {/* Fila 1-2: grande (2×2) + alto (1×2) */}
            <div className="bento-item bento-large">
              <Image src="/img/concierto1.jpeg" alt="Concierto Glory Nights 1" fill sizes="(max-width: 768px) 100vw, 600px" style={{ objectFit: 'cover' }} />
            </div>
            <div className="bento-item bento-tall">
              <Image src="/img/concierto2.jpeg" alt="Concierto Glory Nights 2" fill sizes="(max-width: 768px) 100vw, 300px" style={{ objectFit: 'cover' }} />
            </div>
            {/* Fila 3: 3 items regulares */}
            <div className="bento-item">
              <Image src="/img/concierto3.jpeg" alt="Concierto Glory Nights 3" fill sizes="(max-width: 768px) 100vw, 300px" style={{ objectFit: 'cover' }} />
            </div>
            <div className="bento-item">
              <Image src="/img/concierto4.jpeg" alt="Concierto Glory Nights 4" fill sizes="(max-width: 768px) 100vw, 300px" style={{ objectFit: 'cover' }} />
            </div>
            <div className="bento-item">
              <Image src="/img/concierto5.jpeg" alt="Concierto Glory Nights 5" fill sizes="(max-width: 768px) 100vw, 300px" style={{ objectFit: 'cover' }} />
            </div>
            {/* Fila 4: ancho (2×1) + regular */}
            <div className="bento-item bento-wide">
              <Image src="/img/concierto6.jpeg" alt="Concierto Glory Nights 6" fill sizes="(max-width: 768px) 100vw, 600px" style={{ objectFit: 'cover' }} />
            </div>
            <div className="bento-item">
              <Image src="/img/concierto7.jpeg" alt="Concierto Glory Nights 7" fill sizes="(max-width: 768px) 100vw, 300px" style={{ objectFit: 'cover' }} />
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ══════════════════════════════════════════════════════════
          SECCIÓN DE VÍDEO
          ══════════════════════════════════════════════════════════ */}
      <section className="video-section">
        <video
          className="video-bg"
          autoPlay
          muted
          loop
          playsInline
          preload="none" /* No descargar vídeo hasta que sea necesario */
        >
          <source src="/img/concierto12.mp4" type="video/mp4" />
          <source src="/img/concierto9.mp4" type="video/mp4" />
          <source src="/img/concierto11.mp4" type="video/mp4" />
          <source src="/img/concierto10.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
        <div className="video-content">
          <p className="video-kicker">Gloria en cada nota</p>
          <h2 className="video-title">Una experiencia que<br />no olvidarás</h2>
          <p className="video-body">Más de 500 asistentes han vivido la magia de Glory Nights.<br />Únete a ellos y descubre los conciertos que están marcando la diferencia.</p>
          <AnimatedButton href="/conciertos" className="btn-primary video-cta">
            Ver próximas fechas
          </AnimatedButton>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FAQ
          ══════════════════════════════════════════════════════════ */}
      <AnimatedSection>
        <section className="faq-section">
          <div className="section-header">
            <h2>Preguntas Frecuentes</h2>
            <p>Todo lo que necesitas saber antes de vivir la magia</p>
          </div>
          <div className="faq-container">
            <div className="faq-item">
              <h3>¿Cuál es el código de vestimenta?</h3>
              <p>Recomendamos un estilo elegante casual, acorde a la atmósfera clásica de la localización pero asegurando tu comodidad.</p>
            </div>
            <div className="faq-item glass-panel">
              <h3>¿Puedo tomar fotografías durante la actuación?</h3>
              <p>Se permiten fotografías sin flash antes y después de los conciertos para no interrumpir la experiencia inmersiva del resto de asistentes.</p>
            </div>
            <div className="faq-item glass-panel">
              <h3>¿A qué hora abren las puertas del recinto?</h3>
              <p>Las puertas abren formalmente 45 minutos antes del inicio del evento. Una vez comenzado el concierto no se permitirá el acceso a la sala.</p>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ══════════════════════════════════════════════════════════
          NEWSLETTER
          ══════════════════════════════════════════════════════════ */}
      <NewsletterWidget />

      {/* ══════════════════════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════════════════════ */}
      <footer className="footer-section">
        <div className="footer-logo-area">
          <a href="/">
            <Image
              src="/img/GLORY NIGHTS LOGO.jpeg"
              alt="Glory Nights"
              width={200}
              height={100}
              className="footer-logo-img"
            />
          </a>
        </div>

        <div className="footer-columns">
          <div className="footer-col">
            <h3 className="footer-heading">Contacto</h3>
            <p className="footer-text">info@glorynightsconcerts.com</p>
            <p className="footer-text">+34 600 000 000</p>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">Redes Sociales</h3>
            <div className="social-icons">
              <a href="https://www.instagram.com/glory_nights_concerts?igsh=MWtncnczNmd6bnIzMw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" aria-label="TikTok" className="social-icon-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.17a8.16 8.16 0 0 0 4.76 1.53v-3.5a4.82 4.82 0 0 1-1-.51z" />
                </svg>
              </a>
              <a href="https://www.facebook.com/share/1HM1fH84d8/" aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="social-icon-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" aria-label="YouTube" className="social-icon-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <LinkToMain />
          <p className="copyright">&copy; {new Date().getFullYear()} Glory Nights. Todos los derechos reservados.</p>
        </div>
      </footer>

    </div>
  );
}
