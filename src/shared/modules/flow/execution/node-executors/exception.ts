import { Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import type { INodeExecutor } from "./node-executor.interface.ts";
import { type FlowNode } from "../../types/node.types.ts";

export const BodySchema = Type.Object({
  message: Type.String(),
  code: Type.Optional(Type.String()),
});

const bodySchema = TypeCompiler.Compile(BodySchema);

export const performException: INodeExecutor = function* (node: FlowNode) {
  if (!bodySchema.Check(node.details.body)) {
    throw new Error("Unexpected body format");
  }

  // TODO: throw with context throw() method + throw custom class of error (ExecutionError?)
  throw new Error(node.details.body.message);
};
