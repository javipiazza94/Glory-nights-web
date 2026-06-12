/** @type {import('next').NextConfig} */
const nextConfig = {
  // ─── Optimización de imágenes ───────────────────────────────────
  // Next.js genera automáticamente formatos WebP/AVIF y srcsets
  // responsivos para cada <Image> del proyecto.
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
