import { Static, Type } from "@sinclair/typebox";
import { FlowNodeSchema } from "./node.types.ts";
import { FlowConnectionSchema } from "./connection.types.ts";

export const FlowSchema = Type.Object({
  id: Type.String(),
  nodes: Type.Array(FlowNodeSchema),
  connections: Type.Array(FlowConnectionSchema),
  // Note: all the {{VARIABLE}} values inside the Flow
  //  needed to determine that all variables are still present before the execution
  externalVariablesSet: Type.Array(Type.String(), { uniqueItems: true }),
});

export type Flow = Static<typeof FlowSchema>;
