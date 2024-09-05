import { db } from '@server/db';
import {geminiCredentials} from '@server/db/schema';
import {eq} from "drizzle-orm";
import {NewGeminiCredentials} from "@server/modules/ai-provider/gemini/dto/gemini.dto.ts";


export const getGeminiById = async (id: number) => {
    return db
        .select()
        .from(geminiCredentials)
        .where(eq(geminiCredentials.id, id));
}

export const getAllGeminiCredentials = async () => {
    return db
        .select()
        .from(geminiCredentials);
}

export const createGeminiCredentials = async (gemini: NewGeminiCredentials) => {
    return db
        .insert(geminiCredentials)
        .values(gemini)
        .returning()
}

export const updateApiKey = async (id: number, apiKey: string) => {
    return db
      .update(geminiCredentials)
      .set({ apiKey: apiKey })
      .where(eq(geminiCredentials.id, id));
}

export const deleteGeminiCredentialsById = async (id: number) => {
    return db
        .delete(geminiCredentials)
        .where(eq(geminiCredentials.id, id));
}