import { Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import type { INodeExecutor } from "./node-executor.interface.ts";
import { mapDataItemToTypeBoxSchema } from "../validation.ts";
import { DataItemSchema } from "../../types/data.types.ts";
import { type FlowNode } from "../../types/node.types.ts";

export const BodySchema = Type.Object({
  type: DataItemSchema,
  value: Type.Unknown(),
});

export const bodySchema = TypeCompiler.Compile(BodySchema);

export const performConst: INodeExecutor = function* (node: FlowNode) {
  if (!bodySchema.Check(node.details.body)) {
    throw new Error("Unexpected body format");
  }

  const BodyValueSchema = mapDataItemToTypeBoxSchema(node.details.body.type);
  const bodyValueSchema = TypeCompiler.Compile(BodyValueSchema);

  if (!bodyValueSchema.Check(node.details.body.value)) {
    throw new Error("Unexpected body format");
  }

  return [node.details.body.value];
};
