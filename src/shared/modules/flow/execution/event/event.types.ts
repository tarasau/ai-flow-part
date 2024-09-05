export enum FlowEventType {
  NodeOutputHandleStatusUpdated = "node_output_handle_status_updated",
  NodeInputHandleStatusUpdated = "node_input_handle_status_updated",
  NodeExecutionStarted = "node_execution_started",
}

export type FlowEventTypeDataMap = {
  [FlowEventType.NodeOutputHandleStatusUpdated]: {
    value: unknown;
    nodeId: string;
    nodeHandleId: string;
    status: "initial" | "processing" | "fail" | "success";
  };
  [FlowEventType.NodeInputHandleStatusUpdated]: {
    value: unknown;
    nodeId: string;
    nodeHandleId: string;
    status: "initial" | "processing" | "fail" | "success";
  };
  [FlowEventType.NodeExecutionStarted]: {
    nodeId: string;
  };
};

export type FlowEventYield<T extends FlowEventType> = {
  data: FlowEventTypeDataMap[T];
};
