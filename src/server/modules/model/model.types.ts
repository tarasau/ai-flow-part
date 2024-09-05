import {z} from "zod";
import {jsonSchema} from "@server/modules/flow/flow.types.ts";

export const modelCreateSchema = z
    .object({
        name: z.string().max(100),
        schema: jsonSchema
    })

export type CreateModelDto = z.infer<typeof modelCreateSchema>;