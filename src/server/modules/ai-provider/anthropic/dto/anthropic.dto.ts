import {z} from "zod";
import {anthropicCredentials} from "@server/db/schema.ts";

export type NewAnthropicCredentials = typeof anthropicCredentials.$inferInsert
export const anthropicCredentialsSchema = z.object({
    apiKey: z.string().max(255)
});
