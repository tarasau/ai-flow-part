
import {
    NewAnthropicCredentials
} from "@server/modules/ai-provider/anthropic/dto/anthropic.dto.ts";
import {
    createAnthropicCredentials, deleteAnthropicCredentialsById,
    getAllAnthropicCredentials,
    getAnthropicById, updateApiKey
} from "@server/modules/ai-provider/anthropic/anthropic.repository.ts";


export const getById = async (id: number) => {
    return getAnthropicById(id)
}

export const getAll = async () => {
    return getAllAnthropicCredentials();
}

export const createAnthropic = async (anthropic: NewAnthropicCredentials) => {
   return createAnthropicCredentials(anthropic);
}

export const updateKey = async (id: number, apiKey: string) => {
   await updateApiKey(id, apiKey);
   return id;
}

export const deleteById = async (id: number) => {
    await deleteAnthropicCredentialsById(id);
    return id;
}