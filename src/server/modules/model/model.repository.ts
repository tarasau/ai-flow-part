import {db} from '@server/db';
import {flows, models} from '@server/db/schema';
import {eq} from "drizzle-orm";
import {CreateModelDto} from "@server/modules/model/model.types.ts";


export const getModelById = async (id: number) => {
    return db
        .select()
        .from(models)
        .where(eq(models.id, id))
}
export const getModelByUserId = async (userId: number) => {
    return db
        .select()
        .from(models)
        .where(eq(models.userId, userId))
}

export const createModelEntity = async ( userId: number, model: CreateModelDto)=> {
    return db.insert(flows).values({
        name: model.name,
        schema: model.schema,
        userId: userId
    }).returning();
}

export const updateModelEntity = async ( userId: number, model: CreateModelDto)=> {
    return db.update(flows).set({
        name: model.name,
        schema: model.schema,
    }).where(eq(models.userId, userId)).returning();
}

export const deleteModelById = async (id: number) => {
    return db.delete(models).where(eq(models.id, id))
}

export const deleteModelByUserId = async (userId: number) => {
    return db.delete(models).where(eq(models.userId, userId))
}