import { Static, Type } from "@sinclair/typebox";

export enum DataItemType {
  Array = "array",
  Object = "object",
  String = "string",
  Number = "number",
  Boolean = "boolean",
  Null = "null",
  Signal = "signal",
  Infer = "infer",
}

const StringDataItemSchema = Type.Object({
  type: Type.Literal(DataItemType.String),
});
const NumberDataItemSchema = Type.Object({
  type: Type.Literal(DataItemType.Number),
});
const BooleanDataItemSchema = Type.Object({
  type: Type.Literal(DataItemType.Boolean),
});
const NullDataItemSchema = Type.Object({
  type: Type.Literal(DataItemType.Null),
});
const SignalDataItemSchema = Type.Object({
  type: Type.Literal(DataItemType.Signal),
});
const InferDataItemSchema = Type.Object({
  type: Type.Literal(DataItemType.Infer),
});

export const DataItemSchema = Type.Recursive((This) =>
  Type.Intersect([
    Type.Object({ id: Type.String() }),
    Type.Union([
      StringDataItemSchema,
      NumberDataItemSchema,
      BooleanDataItemSchema,
      NullDataItemSchema,
      SignalDataItemSchema,
      InferDataItemSchema,
      Type.Object({
        type: Type.Literal(DataItemType.Array),
        itemType: This,
      }),
      Type.Object({
        type: Type.Literal(DataItemType.Object),
        structure: Type.Record(Type.String(), This),
      }),
    ]),
  ]),
);

export type DataItem = Static<typeof DataItemSchema>;

// export const createDataItem = <T extends DataItemType>(
//   id: string,
//   type: T,
//   options: T extends DataItemType.Array
//     ? { itemType: DataItem }
//     : T extends DataItemType.Object
//       ? { structure: Record<string, DataItem> }
//       : undefined,
// ): DataItem => {
//   if (type === DataItemType.Array) {
//     if (!options || !("itemType" in options)) {
//       throw new Error("Unexpected input to array data item");
//     }
//
//     return {
//       id,
//       type,
//       itemType: options.itemType,
//     };
//   }
//   if (type === DataItemType.Object) {
//     if (!options || !("structure" in options)) {
//       throw new Error("Unexpected input to array data item");
//     }
//
//     return {
//       id,
//       type,
//       structure: options.structure,
//     };
//   }
//   return {
//     id,
//     type,
//   };
// };
