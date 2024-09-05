import { FlowNode } from "../../types/node.types.ts";

export type INodeExecutor = (
  node: FlowNode,
  inputs: Array<unknown>,
) => Generator<
  null | unknown | Promise<null> | Promise<unknown>,
  Array<unknown>,
  Array<unknown>
>;
