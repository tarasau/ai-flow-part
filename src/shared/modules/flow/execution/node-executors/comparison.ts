import { type FlowNode } from "../../types/node.types.ts";
import type { INodeExecutor } from "./node-executor.interface.ts";
import { Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

export enum ComparisonFlowNodeOperator {
  LessThan = "<",
  LessThanOrEqual = "<=",
  MoreThan = ">",
  MoreThanOrEqual = ">=",
  Equal = "=",
}

export const BodySchema = Type.Object({
  operator: Type.Enum(ComparisonFlowNodeOperator),
});

const bodySchema = TypeCompiler.Compile(BodySchema);

export const performComparison: INodeExecutor = function* (
  node: FlowNode,
  values: Array<unknown>,
) {
  if (values.length !== 2) {
    throw new Error("Unexpected input format");
  }
  if (!bodySchema.Check(node.details.body)) {
    throw new Error("Unexpected body format");
  }

  const operator = node.details.body.operator;
  const [value1, value2] = values;

  // TODO: implement a better version with type checks and complex params comparison (array by length and objects by stringify().length)

  switch (operator) {
    case ComparisonFlowNodeOperator.LessThan:
      return [value1 < value2];
    case ComparisonFlowNodeOperator.LessThanOrEqual:
      return [value1 <= value2];
    case ComparisonFlowNodeOperator.MoreThan:
      return [value1 > value2];
    case ComparisonFlowNodeOperator.MoreThanOrEqual:
      return [value1 >= value2];
    case ComparisonFlowNodeOperator.Equal:
      yield new Promise((resolve) => setTimeout(resolve, 1000)).then(
        () => null,
      );
      return [value1 === value2];
  }
};
