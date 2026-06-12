# Contexto del proyecto — Glory Nights

## Proyecto

- **Nombre:** Glory Nights — Portal de Conciertos Tributo
- **Descripción:** Plataforma web premium para promoción y gestión de conciertos tributo a la luz de las velas. Incluye cartelera pública, páginas de artistas/salas, formulario de contacto y dashboard de administración privado.
- **Fase:** SEMI-ACTIVO — mantenimiento y mejoras puntuales
- **Deploy:** Vercel (producción) + Turso cloud DB

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 15 (App Router) |
| Estilos | Tailwind CSS + glassmorphism custom |
| UI | Base UI (@base-ui/react) + Lucide |
| DB dev | LibSQL local (`promoter.db`) |
| DB prod | Turso cloud |
| Email | Resend |
| Tests | @testing-library/react + Babel |

## Entidades principales

- `bands` — bandas tributo (nombre, artista original, descripción, imagen, vídeo)
- `venues` — salas (nombre, ciudad, aforo, imagen)
- `concerts` — conciertos (banda, sala, fecha, precio, entradas)
- `artists` — artistas individuales
- `contact_messages` — mensajes del formulario de contacto

## Decisiones de diseño clave

- **Glassmorphism premium**: estética elegante con fondos oscuros y acentos dorados/ámbar
- **Tipografía**: Playfair Display (headings) + Montserrat (body)
- **DB híbrida**: `database.js` detecta env → local o Turso automáticamente
- **`PRAGMA foreign_keys = ON`** activado por conexión — no saltarse esto
- **Honeypot anti-spam** en formulario de contacto — no eliminar el campo trampa
- **Cartelera automática**: futuros/pasados calculados por fecha — no hardcodear
- **SEO**: metadatos específicos en cada ruta

## Restricciones

- Mantener el estilo glassmorphism en todos los componentes nuevos
- `promoter.db` nunca va a git
- Webhook/API tokens nunca en el código fuente
