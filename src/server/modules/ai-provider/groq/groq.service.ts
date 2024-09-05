import {
    createGroqCredentials, deleteGroqCredentialsById,
    getAllGroqCredentials,
    getGroqById, updateApiKey
} from "@server/modules/ai-provider/groq/groq.repository.ts";
import {NewGroqCredentials} from "@server/modules/ai-provider/groq/dto/groq.dto.ts";


export const getById = async (id: number) => {
    return getGroqById(id)
}

export const getAll = async () => {
    return getAllGroqCredentials()
}

export const createGroq = async (groq: NewGroqCredentials) => {
   return createGroqCredentials(groq);
}

export const updateKey = async (id: number, apiKey: string) => {
   await updateApiKey(id, apiKey);
   return id;
}

export const deleteById = async (id: number) => {
    await deleteGroqCredentialsById(id);
    return id;
}