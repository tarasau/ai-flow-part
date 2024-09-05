import { z } from 'zod';



export const jsonSchema = z.record(z.string(), z.unknown())

export const flowCreateSchema = z
    .object({
        name: z.string().max(100),
        schema: jsonSchema
    })

export type CreateFlowDto = z.infer<typeof flowCreateSchema>;
