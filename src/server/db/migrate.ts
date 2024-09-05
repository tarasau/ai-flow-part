import { isNeonDatabase, isPgDatabase } from '@server/db/db.types.ts';
import { getConfig } from '@server/config.ts';
import { db } from './';

const main = async () => {
  try {
    if (getConfig().env !== 'prod') {
      if (isPgDatabase(db)) {
        const { migrate: migratePG } = await import('drizzle-orm/node-postgres/migrator');

        await migratePG(db, {
          migrationsFolder: 'src/server/db/migrations',
        });
      }
    } else {
      if (isNeonDatabase(db)) {
        const { migrate: migrateNeon } = await import('drizzle-orm/neon-http/migrator');

        await migrateNeon(db, {
          migrationsFolder: 'src/server/db/migrations',
        });
      }
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();
