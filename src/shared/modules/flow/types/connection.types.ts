import { Static, Type } from "@sinclair/typebox";

export const FlowConnectionSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  item1Id: Type.String(),
  item2Id: Type.String(),
  item1HandleId: Type.String(),
  item2HandleId: Type.String(),
});

export type FlowConnection = Static<typeof FlowConnectionSchema>;
