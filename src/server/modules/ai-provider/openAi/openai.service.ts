import {
    createOpenAiCredentials, deleteOpenAiCredentialsById,
    getAllOpenAiCredentials,
    getOpenAiById, updateApiKey
} from "@server/modules/ai-provider/openAi/openai.repository.ts";
import {NewOpenAiCredentials} from "@server/modules/ai-provider/openAi/dto/openai.dto.ts";


export const getById = async (id: number) => {
    return getOpenAiById(id)
}

export const getAll = async () => {
    return getAllOpenAiCredentials();
}

export const createOpenAi = async (openai: NewOpenAiCredentials) => {
   return createOpenAiCredentials(openai)
}

export const updateKey = async (id: number, apiKey: string) => {
   await updateApiKey(id,apiKey)
   return id;
}

export const deleteById = async (id: number) => {
    await deleteOpenAiCredentialsById(id);
    return id;
}