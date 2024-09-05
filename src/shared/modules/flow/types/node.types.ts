import { Type, Static } from "@sinclair/typebox";
import { DataItemSchema } from "./data.types.ts";
// import metaSchema from "ajv/lib/refs/json-schema-draft-07.json";

// const ajv = new Ajv({
//   defaultMeta: "http://json-schema.org/draft-07/schema#",
// });
//
// TypeRegistry.Set("Schema", (schema, value) => {
//   console.log("schema", schema);
//   const res = ajv.validateSchema(value as AnySchema);
//
//   if (typeof res !== "boolean") {
//     return false;
//   }
//
//   return res;
// });
//
// const Schema = Type.Unsafe<TSchema>({ [Kind]: "Schema" });

// const UnReservedFlowNodeTypeFormat = "unreserved-flow-type" as const;

export enum ReservedFlowNodeType {
  Start = "start",
  End = "end",
}
// export enum InputOutputType {
//   Array = "array",
//   Tuple = "tuple",
// }
//
// FormatRegistry.Set(
//   UnReservedFlowNodeTypeFormat,
//   (value) => !Object.values<string>(ReservedFlowNodeType).includes(value),
// );

// export enum FlowNodeType {
//   Start = "start",
//   End = "end",
//   Const = "const",
//   Exception = "exception",
//   Comparison = "comparison",
//   LLM = "llm",
//   // Regex = 'regex',
//   // Http = 'http',
//   // Log = 'log', // Inter input, just show the value inside
// }

// TODO: write a typebox for custom node (all except for default 3 has to be injected)
// TODO: work on node type injection for executor (type has to be unique (check and throw) )
// TODO: continue to write README after
// const NodeType = Type.Object({
//   type: Type.String({ format: UnReservedFlowNodeTypeFormat }),
//   body: Schema,
//   inputs: Type.Object({
//     type: Type.Enum(InputOutputType),
//     value: Type.Array(Type.Enum(DataItemType)),
//   }),
//   outputs: Type.Object({
//     type: Type.Enum(InputOutputType),
//     value: Type.Array(Type.Enum(DataItemType)),
//   }),
// });

const FlowNodeDetailsSchema = Type.Object({
  type: Type.String(),
  body: Type.Unknown(),
  inputs: Type.Array(DataItemSchema),
  outputs: Type.Array(DataItemSchema),
});

// type StartFlowNode = {
//   type: FlowNodeType.Start;
//   body: null;
//   inputs: [];
//   outputs: Array<Exclude<DataItem, { type: DataItemType.Infer }>>;
// };
// type EndFlowNode = {
//   type: FlowNodeType.End;
//   body: null;
//   inputs: Array<Extract<DataItem, { type: DataItemType.Infer }>>;
//   outputs: [];
// };
// TODO: IF NEEDED do a deep inference somehow (recursive generic type maybe)
// type ConstFlowNode = {
//     [K in keyof DataItemEnumTypeMap]: {
//         type: FlowNodeType.Const;
//         body: { type: K, value: DataItemEnumTypeMap[K] };
//         inputs: [];
//         outputs: [Extract<DataItem, { type: K }>];
//     };
// }[keyof DataItemEnumTypeMap];
// type ConstFlowNode = {
//   type: FlowNodeType.Const;
//   body: { type: DataItemType; value: string };
//   inputs: [];
//   outputs: [Extract<DataItem, { type: DataItemType.Infer }>];
// };
// type ExceptionFlowNode = {
//   type: FlowNodeType.Exception;
//   body: { message: string; code?: string };
//   inputs: [Extract<DataItem, { type: DataItemType.Signal }>];
//   outputs: [];
// };
// export enum ComparisonFlowNodeOperator {
//   LessThan = "<",
//   LessThanOrEqual = "<=",
//   MoreThan = ">",
//   MoreThanOrEqual = ">=",
//   Equal = "=",
// }
// type ComparisonFlowNode = {
//   [K in keyof DataItemEnumTypeMap]: {
//     type: FlowNodeType.Comparison;
//     body: { operator: ComparisonFlowNodeOperator };
//     inputs: [Extract<DataItem, { type: K }>, Extract<DataItem, { type: K }>];
//     outputs: [Extract<DataItem, { type: DataItemType.Boolean }>];
//   };
// }[keyof DataItemEnumTypeMap];
// type PromptFlowNode = {
//   type: FlowNodeType.LLM;
//   body: { prompt: string };
//   inputs: Array<Exclude<DataItem, { type: DataItemType.Infer }>>;
//   outputs: Array<Exclude<DataItem, { type: DataItemType.Infer }>>;
// };

export const FlowNodeSchema = Type.Object({
  id: Type.String(),
  type: Type.String(),
  name: Type.String(),
  position: Type.Object({ x: Type.Number(), y: Type.Number() }),
  details: FlowNodeDetailsSchema,
});

export type FlowNode = Static<typeof FlowNodeSchema>;
