import { db } from '@server/db';
import {groqCredentials} from '@server/db/schema';
import {eq} from "drizzle-orm";
import {NewGroqCredentials} from "@server/modules/ai-provider/groq/dto/groq.dto.ts";


export const getGroqById = async (id: number) => {
    return db
        .select()
        .from(groqCredentials)
        .where(eq(groqCredentials.id, id));
}

export const getAllGroqCredentials = async () => {
    return db
        .select()
        .from(groqCredentials);
}

export const createGroqCredentials = async (groq: NewGroqCredentials) => {
    return db
        .insert(groqCredentials)
        .values(groq)
        .returning()
}

export const updateApiKey = async (id: number, apiKey: string) => {
    return db
        .update(groqCredentials)
        .set({ apiKey: apiKey })
        .where(eq(groqCredentials.id, id));
}

export const deleteGroqCredentialsById = async (id: number) => {
    return db
        .delete(groqCredentials)
        .where(eq(groqCredentials.id, id));
}