import { createClient } from "@libsql/client";

// Utiliza la URL local si es desarrollo, o la nube Turso si está subido a Vercel
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:promoter.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

let dbReady = null;

async function initializeDatabase() {
  try {
    // CRITICAL: SQLite/LibSQL does NOT enforce foreign keys by default.
    // This pragma must be enabled per connection before any DML.
    await client.execute('PRAGMA foreign_keys = ON');

    await client.execute(`
      CREATE TABLE IF NOT EXISTS bands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        tributeTo TEXT NOT NULL,
        description TEXT,
        imageUrl TEXT,
        videoUrl TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS venues (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        capacity INTEGER,
        contactEmail TEXT,
        imageUrl TEXT,
        videoUrl TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS concerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        band_id INTEGER,
        venue_id INTEGER,
        date TEXT NOT NULL,
        ticketUrl TEXT,
        videoUrl TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (band_id) REFERENCES bands (id) ON DELETE SET NULL,
        FOREIGN KEY (venue_id) REFERENCES venues (id) ON DELETE SET NULL
      )
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        senderName TEXT NOT NULL,
        senderEmail TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT NOT NULL,
        subscriber_id INTEGER REFERENCES subscribers(id) ON DELETE SET NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        name TEXT,
        subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        author TEXT NOT NULL,
        text TEXT NOT NULL,
        concert_label TEXT,
        concert_id INTEGER REFERENCES concerts(id) ON DELETE SET NULL,
        subscriber_id INTEGER REFERENCES subscribers(id) ON DELETE SET NULL,
        stars INTEGER NOT NULL DEFAULT 5,
        visible INTEGER NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ── Analytics: tracking de eventos local (sin cookies) ──
    await client.execute(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_name TEXT NOT NULL,
        metadata TEXT,
        page_url TEXT,
        referrer TEXT,
        event_timestamp TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database schema ensured.');

    // Migrations for existing databases that were created before these columns existed
    const migrations = [
      `ALTER TABLE venues ADD COLUMN imageUrl TEXT`,
      `ALTER TABLE venues ADD COLUMN videoUrl TEXT`,
      `ALTER TABLE venues ADD COLUMN description TEXT`,
      `ALTER TABLE bands ADD COLUMN videoUrl TEXT`,
      `ALTER TABLE concerts ADD COLUMN videoUrl TEXT`,
      `ALTER TABLE concerts ADD COLUMN description TEXT`,
      `ALTER TABLE reviews ADD COLUMN concert_id INTEGER REFERENCES concerts(id) ON DELETE SET NULL`,
      `ALTER TABLE reviews ADD COLUMN subscriber_id INTEGER REFERENCES subscribers(id) ON DELETE SET NULL`,
      `ALTER TABLE messages ADD COLUMN subscriber_id INTEGER REFERENCES subscribers(id) ON DELETE SET NULL`,
    ];
    for (const sql of migrations) {
      try { await client.execute(sql); } catch (e) { /* column already exists */ }
    }
    console.log('Migrations checked.');
  } catch (error) {
    console.error('Failed to initialize database schema', error);
  }
}

/**
 * Ensures the database is initialized before any query.
 * Call `await ensureDb()` at the start of every API handler.
 */
async function ensureDb() {
  if (!dbReady) {
    dbReady = initializeDatabase();
  }
  await dbReady;
}

// Kick off initialization eagerly (but API handlers also await it)
ensureDb();

export { client, ensureDb };
