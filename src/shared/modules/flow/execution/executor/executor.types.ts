import { Flow } from "../../types/flow.types.ts";

export enum NodeExecutionStatus {
  Initial = "initial",
  Processing = "processing",
  Done = "done",
}

export enum NodeHandleExecutionStatus {
  Initial = "initial",
  Processing = "processing",
  Done = "done",
}

export type FlowExecutorState = {
  isRunning: boolean;
  flow: Flow;
  nodeStatusMap: Map<string, NodeExecutionStatus>;
  nodeHandleStatusMap: Map<string, NodeHandleExecutionStatus>;
  nodeHandleValue: Map<string, unknown>;
};
