import {
    createGeminiCredentials, deleteGeminiCredentialsById,
    getAllGeminiCredentials,
    getGeminiById, updateApiKey,
} from '@server/modules/ai-provider/gemini/gemini.repository.ts';
import {NewGeminiCredentials} from "@server/modules/ai-provider/gemini/dto/gemini.dto.ts";


export const getById = async (id: number) => {
    return getGeminiById(id);
}

export const getAll = async () => {
    return getAllGeminiCredentials();
}

export const createGemini = async (gemini: NewGeminiCredentials) => {
    return createGeminiCredentials(gemini);
}

export const updateGemini = async (id: number, apiKey: string) => {
    await updateApiKey(id, apiKey);
    return id;
}

export const deleteById = async (id: number) => {
    await deleteGeminiCredentialsById(id);
    return id;
}