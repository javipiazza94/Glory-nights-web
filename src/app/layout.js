import { Montserrat, Playfair_Display } from 'next/font/google';
import './globals.css';
import NavBar from './components/NavBar';
import JsonLd from './components/JsonLd';
import { Analytics } from "@vercel/analytics/next";

// ── Fuentes optimizadas con display: swap para evitar FOUT ──
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

// ── Metadata SEO global con OpenGraph y Twitter Cards ──
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://glorynightsconcerts.com'),
  title: {
    default: 'Glory Nights | Conciertos bajo una nueva luz',
    template: '%s | Glory Nights',
  },
  description: 'Descubre los mejores conciertos tributo en una atmósfera íntima y mágica a la luz de las velas. Los Beatles, Mecano, Harry Potter y más.',
  keywords: ['conciertos tributo', 'candlelight', 'música en vivo', 'Glory Nights', 'conciertos velas', 'Sevilla', 'Cádiz'],
  authors: [{ name: 'Glory Nights' }],
  creator: 'Glory Nights',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'Glory Nights',
    title: 'Glory Nights | Conciertos bajo una nueva luz',
    description: 'Descubre los mejores conciertos tributo en una atmósfera íntima y mágica a la luz de las velas.',
    images: [{ url: '/img/conciertos-de-verano.jpg', width: 1200, height: 630, alt: 'Glory Nights - Conciertos tributo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glory Nights | Conciertos bajo una nueva luz',
    description: 'Conciertos tributo en una atmósfera íntima y mágica a la luz de las velas.',
    images: ['/img/conciertos-de-verano.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ── JSON-LD Schema: Organization ──
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Glory Nights',
  description: 'Promotora de conciertos tributo a la luz de las velas en Andalucía.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://glorynightsconcerts.com',
  logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://glorynightsconcerts.com'}/img/GLORY NIGHTS LOGO.jpeg`,
  sameAs: [
    'https://www.instagram.com/glory_nights_concerts',
    'https://www.facebook.com/share/1HM1fH84d8/',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'info@glorynightsconcerts.com',
    contactType: 'customer service',
    availableLanguage: 'Spanish',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${montserrat.variable} ${playfair.variable}`}>
      <body className={montserrat.className}>
        <NavBar />
        <main>{children}</main>
        <JsonLd data={organizationSchema} />
        <Analytics />
      </body>
    </html>
  );
}
