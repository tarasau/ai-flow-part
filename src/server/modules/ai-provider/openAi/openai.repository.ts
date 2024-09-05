import { db } from '@server/db';
import {openAiCredentials} from '@server/db/schema';
import {eq} from "drizzle-orm";
import {NewOpenAiCredentials} from "@server/modules/ai-provider/openAi/dto/openai.dto.ts";


export const getOpenAiById = async (id: number) => {
    return db
        .select()
        .from(openAiCredentials)
        .where(eq(openAiCredentials.id, id));
}

export const getAllOpenAiCredentials = async () => {
    return db
        .select()
        .from(openAiCredentials);
}

export const createOpenAiCredentials = async (openai: NewOpenAiCredentials) => {
    return db
        .insert(openAiCredentials)
        .values(openai).returning()
}

export const updateApiKey = async (id: number, apiKey: string) => {
    return db
        .update(openAiCredentials)
        .set({ apiKey: apiKey })
        .where(eq(openAiCredentials.id, id));
}

export const deleteOpenAiCredentialsById = async (id: number) => {
    return db
        .delete(openAiCredentials)
        .where(eq(openAiCredentials.id, id));
}