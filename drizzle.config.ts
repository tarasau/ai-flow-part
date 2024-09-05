import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DB_URL!,
    },
    schema: "./src/server/db/schema.ts",
    out: "./src/server/db/migrations",
});