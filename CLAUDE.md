# CLAUDE.md — Glory Nights

Portal web premium para conciertos tributo a la luz de las velas.
Gestión de bandas, salas, conciertos y un dashboard de administración privado.

Para reglas globales (seguridad, modelos, flujo) → lee `~/.claude/CLAUDE.md`

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 15 (App Router) |
| Estilos | Tailwind CSS + glassmorphism custom |
| UI | Base UI (@base-ui/react) + Lucide icons |
| DB local | LibSQL (`promoter.db`) via `@libsql/client` |
| DB producción | Turso (cloud LibSQL) |
| Deploy | Vercel + Turso |
| Email | Resend (notificaciones de contacto) |
| Tests | @testing-library/react + Babel |

---

## Estructura

```
Cayetano-Piazza-web/
├── src/
│   ├── app/
│   │   ├── (auth)/         ← login
│   │   ├── artistas/       ← páginas de bandas tributo
│   │   ├── conciertos/     ← cartelera (futuros + pasados)
│   │   ├── venues/         ← salas de concierto
│   │   ├── dashboard/      ← admin privado (CRUD)
│   │   ├── contact/        ← formulario con honeypot anti-spam
│   │   └── sobre-nosotros/
│   ├── components/
│   └── lib/
├── public/
├── database.js             ← cliente LibSQL + inicialización de tablas
├── promoter.db             ← DB local SQLite (en .gitignore)
└── .claude/
    └── agents/
```

---

## Entidades principales

| Entidad | Descripción |
|---------|-------------|
| `bands` | Bandas tributo (nombre, tribute_to, descripción, imagen, vídeo) |
| `venues` | Salas de concierto (nombre, ciudad, aforo, imagen) |
| `concerts` | Conciertos (banda, sala, fecha, precio, entradas disponibles) |
| `artists` | Artistas individuales |
| `contact_messages` | Mensajes del formulario de contacto |

---

## Comandos de desarrollo

```bash
npm run dev       # Desarrollo en :3000
npm run build     # Build de producción
npm run test      # Tests con @testing-library
npm run lint      # ESLint
```

---

## Variables de entorno (`.env.local`)

```
# Desarrollo: usa archivo local (promoter.db) si no se define TURSO_DATABASE_URL
TURSO_DATABASE_URL=libsql://[tu-db].turso.io
TURSO_AUTH_TOKEN=your_token_here
RESEND_API_KEY=your_key_here
DASHBOARD_PASSWORD=your_password_here
```

En Vercel → Settings → Environment Variables para producción.

---

## Agentes y Skills relevantes para este proyecto

| Tarea | Agente / Skill |
|-------|---------------|
| Componentes UI, dark mode, glassmorphism | `ui-ux-polisher`, `frontend-developer` |
| Diseño visual, sistema de colores | `ui-designer` |
| Tests de componentes, e2e | `api-tester`, `test-results-analyzer` |
| Security review (honeypot, formularios) | `security-auditor` |
| Feature completa (UI + API route + DB) | `/feature` |
| Preparar deploy a Vercel | `/ship` |

---

## Reglas del proyecto

- **Diseño glassmorphism**: mantener el estilo premium. No introducir componentes con aspecto plano/genérico sin adaptarlos al sistema de diseño
- **DB híbrida**: `database.js` detecta automáticamente local vs. Turso — no romper esta lógica
- **`PRAGMA foreign_keys = ON`**: se activa por conexión en `database.js` — no saltárselo
- **Cartelera automática**: la separación futuros/pasados se basa en la fecha del concierto — no hardcodear
- **Honeypot anti-spam**: el campo trampa del formulario de contacto es invisible — no eliminarlo
- **SEO**: cada página tiene sus propios metadatos — actualizar al añadir rutas nuevas

---

## Deploy

```bash
# Push a main → Vercel auto-deploya en ~30s
# Variables sensibles: Vercel → Settings → Environment Variables
# promoter.db NO va a git (en .gitignore)
```

---

## Tipografía y diseño

- Headings: **Playfair Display** (serif, elegante)
- Body: **Montserrat** (sans-serif, legible)
- Paleta: oscura con acentos dorados/ámbar (glassmorphism)
- Mobile first, responsive en todos los breakpoints
