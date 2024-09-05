import {db} from '@server/db';
import {flows} from '@server/db/schema';
import {eq} from "drizzle-orm";
import {CreateFlowDto} from "@server/modules/flow/flow.types.ts";


export const getFlowById = async (id: number) => {
    return db
        .select()
        .from(flows)
        .where(eq(flows.id, id))
}

export const getFlowByUserId = async (userId: number) => {
    return db
        .select()
        .from(flows)
        .where(eq(flows.userId, userId))
}

export const createFlowEntity = async (userId: number, flow: CreateFlowDto)=> {
    return db.insert(flows).values({
        name: flow.name,
        schema: flow.schema,
        userId: userId
    }).returning();
}

export const updateFlowEntity = async (userId: number, flow: CreateFlowDto)=> {
    return db.update(flows).set({
        name: flow.name,
        schema: flow.schema,
    }).where(eq(flows.userId, userId)).returning();
}

export const deleteFlowById = async (id: number) => {
    return db.delete(flows).where(eq(flows.id, id))
}

export const deleteFlowByUserId = async (userId: number) => {
    return db.delete(flows).where(eq(flows.userId, userId))
}