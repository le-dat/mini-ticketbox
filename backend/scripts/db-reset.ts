import { Pool } from 'pg';
import * as fs from 'fs/promises';
import * as path from 'path';

async function resetDatabase() {
  // Safety guard for production environment
  if (process.env.NODE_ENV === 'production') {
    console.error('CRITICAL WARNING: Database reset script was triggered in PRODUCTION environment!');
    console.error('Reset execution aborted to prevent accidental data loss.');
    process.exit(1);
  }

  console.log('Starting database reset process...');

  const host = process.env.DATABASE_HOST || 'postgres';
  const port = process.env.DATABASE_PORT || 5432;
  const user = process.env.DATABASE_USER || 'ticketbox_user';
  const password = process.env.DATABASE_PASSWORD || 'ticketbox_password';
  const database = process.env.DATABASE_NAME || 'ticketbox_db';

  const pool = new Pool({
    host,
    port: Number(port),
    user,
    password,
    database,
  });

  const client = await pool.connect();

  try {
    console.log('Truncating tables: orders, tickets...');
    // Truncate tables and restart auto-increment identities (sequences)
    await client.query('TRUNCATE TABLE orders, tickets RESTART IDENTITY;');
    console.log('Tables truncated successfully.');

    // Find and execute seed.sql from backend/database/seed.sql
    const seedPath = path.join(process.cwd(), 'database', 'seed.sql');
    console.log(`Reading seed SQL from: ${seedPath}`);
    const seedSql = await fs.readFile(seedPath, 'utf8');

    console.log('Running database seed...');
    await client.query(seedSql);
    console.log('Database reset and seed completed successfully!');
  } catch (error) {
    const err = error as Error;
    console.error('Failed to reset database:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

resetDatabase().catch((err) => {
  console.error('Unhandled reset script error:', err);
  process.exit(1);
});
