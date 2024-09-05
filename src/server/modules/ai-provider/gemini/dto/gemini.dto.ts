import {z} from "zod";
import {geminiCredentials} from "@server/db/schema.ts";

export type NewGeminiCredentials = typeof geminiCredentials.$inferInsert

export const geminiCredentialsSchema = z.object({
    apiKey: z.string().max(255)
});