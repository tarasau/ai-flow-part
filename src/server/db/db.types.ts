import * as schema from "@server/db/schema.ts";
import { NeonHttpDatabase, NeonHttpSession } from "drizzle-orm/neon-http";
import { NodePgDatabase, NodePgSession } from "drizzle-orm/node-postgres";

export type Database =
  | NeonHttpDatabase<typeof schema>
  | NodePgDatabase<typeof schema>;

export const isPgDatabase = (
  db: object,
): db is NodePgDatabase<typeof schema> => {
  return "session" in db && db.session instanceof NodePgSession;
};

export const isNeonDatabase = (
  db: object,
): db is NeonHttpDatabase<typeof schema> => {
  return "session" in db && db.session instanceof NeonHttpSession;
};
