import { db } from '@server/db';
import {anthropicCredentials} from '@server/db/schema';
import {eq} from "drizzle-orm";
import {
    NewAnthropicCredentials
} from "@server/modules/ai-provider/anthropic/dto/anthropic.dto.ts";


export const getAnthropicById = async (id: number) => {
    return db
        .select()
        .from(anthropicCredentials)
        .where(eq(anthropicCredentials.id, id));
}

export const getAllAnthropicCredentials = async () => {
    return db
        .select()
        .from(anthropicCredentials);
}

export const createAnthropicCredentials = async (anthropic: NewAnthropicCredentials) => {
    return db
        .insert(anthropicCredentials)
        .values(anthropic)
        .returning()
}

export const updateApiKey = async (id: number, apiKey: string) => {
    return db
        .update(anthropicCredentials)
        .set({ apiKey: apiKey })
        .where(eq(anthropicCredentials.id, id));
}

export const deleteAnthropicCredentialsById = async (id: number) => {
    return db
        .delete(anthropicCredentials)
        .where(eq(anthropicCredentials.id, id));
}