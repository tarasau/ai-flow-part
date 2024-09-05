import { Static, Type } from "@sinclair/typebox";

export const PluginSchema = Type.Object({
  id: Type.String(),
  executor: Type.String(),
  html: Type.String(),
  css: Type.String(),
  js: Type.String(),
});

export type FlowPlugin = Static<typeof PluginSchema>;
