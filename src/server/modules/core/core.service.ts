
import {CreateCoreInfoDto} from "@server/modules/core/core.types.ts";
import {createAll, deleteAllByUserId, getAllByUserId} from "@server/modules/core/core.repository.ts";
import {db} from "@server/db";

export const getAll = async (userId: number) => {
  return getAllByUserId(userId)
};

export const createAllInfo = async (core: CreateCoreInfoDto, userId: number) => {
  return await db.transaction(async () => {
    return await createAll(userId, core);
  })
};

export const updateAllInfo = async (core: CreateCoreInfoDto, userId: number) => {
  return await db.transaction(async () => {
    await deleteAllByUserId(userId);
    return await createAll(userId, core);
  })
}

export const deleteAllInfo = async (userId: number) => {
  await db.transaction(async () => {
    await deleteAllByUserId(userId);
  })
};
