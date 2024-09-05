import { DataItemType } from "../../types/data.types.ts";
import { type FlowNode } from "../../types/node.types.ts";
import type { INodeExecutor } from "./node-executor.interface.ts";
import { Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { call } from "redux-saga/effects";

const generatorFetch = function* <T>(
  url: string,
  method: "POST" | "GET",
  body?: Record<string, unknown>,
) {
  const rawResponse = (yield call(fetch, url, {
    method,
    mode: "cors",
    headers: new Headers({ "content-type": "application/json" }),
    body: body ? JSON.stringify(body) : undefined,
  })) as unknown as Response;

  return (yield rawResponse.json()) as unknown as T;
};

const valueToString = (value: unknown) => {
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  if (typeof value === "undefined") {
    return "";
  }

  return value.toString();
};

export const BodySchema = Type.Object({
  prompt: Type.String(),
});

export const bodySchema = TypeCompiler.Compile(BodySchema);

export const performLLM: INodeExecutor = function* (
  node: FlowNode,
  values: Array<unknown>,
) {
  if (node.details.outputs.length !== 1) {
    throw new Error("Unexpected output format");
  }
  if (!bodySchema.Check(node.details.body)) {
    throw new Error("Unexpected body format");
  }

  const promptTemplate = node.details.body.prompt;
  const prompt = values.reduce<string>(
    (acc, value, i) => acc.replaceAll(`{{${i}}}`, valueToString(value)),
    promptTemplate,
  );

  const content = yield* generatorFetch<{ success: true; data: string }>(
    "http://localhost:3005/execute",
    "POST",
    {
      prompt,
    },
  );

  if (!content.success) {
    throw new Error("Error during generation process");
  }

  const output = node.details.outputs.at(0);

  if (output?.type === DataItemType.Object) {
    return [JSON.parse(content.data)];
  }
  if (output?.type === DataItemType.Array) {
    return [JSON.parse(content.data)];
  }

  // TODO: handle error (parsing / api call / result success=false)

  return [content.data];
};
