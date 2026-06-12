/**
 * JsonLd.js
 * ─────────────────────────────────────────────────────────────────
 * Componente reutilizable para inyectar JSON-LD structured data
 * en el <head> de la página. Google usa estos schemas para
 * entender mejor el contenido y mostrar rich snippets.
 *
 * Ejemplo de uso:
 *   <JsonLd data={{
 *     "@context": "https://schema.org",
 *     "@type": "Organization",
 *     "name": "Glory Nights",
 *   }} />
 */
export default function JsonLd({ data }) {
    if (!data) return null;

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
