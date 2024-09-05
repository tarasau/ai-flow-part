import { type DataItem, DataItemType } from "../types/data.types.ts";
import { type TSchema, Type } from "@sinclair/typebox";
import { FlowNode } from "../types/node.types.ts";
import Ajv from "ajv";
import addFormats from "ajv-formats";

export const mapDataItemToTypeBoxSchema = (
  dataItem: Exclude<DataItem, "id">,
): TSchema => {
  if (dataItem.type === DataItemType.Boolean) {
    return Type.Boolean();
  }
  if (dataItem.type === DataItemType.String) {
    return Type.String();
  }
  if (dataItem.type === DataItemType.Number) {
    return Type.Number();
  }
  if (dataItem.type === DataItemType.Null) {
    return Type.Null();
  }
  if (dataItem.type === DataItemType.Infer) {
    return Type.Any();
  }
  if (dataItem.type === DataItemType.Signal) {
    return Type.Symbol();
  }
  if (dataItem.type === DataItemType.Array) {
    return Type.Array(mapDataItemToTypeBoxSchema(dataItem.itemType));
  }
  if (dataItem.type === DataItemType.Object) {
    return Type.Object(
      Object.entries(dataItem.structure).reduce((acc, [key, item]) => {
        return {
          ...acc,
          [key]: mapDataItemToTypeBoxSchema(item),
        };
      }, {}),
    );
  }

  throw new Error("Not implemented");
};

export const craftTypeBox = (nodeDetails: FlowNode["details"]) => {
  const inputSchemas = nodeDetails.inputs.map(mapDataItemToTypeBoxSchema);
  const outputSchemas = nodeDetails.outputs.map(mapDataItemToTypeBoxSchema);

  return { inputSchemas, outputSchemas };
};

const ajv = addFormats(new Ajv({}), [
  "date-time",
  "time",
  "date",
  "email",
  "hostname",
  "ipv4",
  "ipv6",
  "uri",
  "uri-reference",
  "uuid",
  "uri-template",
  "json-pointer",
  "relative-json-pointer",
  "regex",
]);

export const validateWithTypebox = (schema: TSchema, data: unknown) => {
  return ajv.validate(schema, data);
};
