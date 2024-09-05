
import {z} from "zod";
import {openAiCredentials} from "@server/db/schema.ts";

export type NewOpenAiCredentials = typeof openAiCredentials.$inferInsert

export const openAiCredentialsSchema = z.object({
    apiKey: z.string().max(255)
});