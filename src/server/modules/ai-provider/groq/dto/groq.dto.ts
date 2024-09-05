import {z} from "zod";
import {groqCredentials} from "@server/db/schema.ts";

export type NewGroqCredentials = typeof groqCredentials.$inferInsert

export const groqCredentialsSchema = z.object({
    apiKey: z.string().max(255)
});