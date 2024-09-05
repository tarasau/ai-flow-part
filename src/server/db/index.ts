import { getConfig } from '@server/config.ts';
import * as schema from './schema';
import { Database } from './db.types';

let db: Database;

if (getConfig().env === 'prod') {
  const { neon } = await import('@neondatabase/serverless');
  const { drizzle: drizzleNeon } = await import('drizzle-orm/neon-http');

  db = drizzleNeon(neon(getConfig().dbUrl), {
    schema,
  });
} else {
  const { Pool } = await import('pg');
  const { drizzle: drizzlePG } = await import('drizzle-orm/node-postgres');

  const client = new Pool({ connectionString: getConfig().dbUrl });

  db = drizzlePG(client, { schema });
}

export { db };
