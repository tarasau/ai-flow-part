import {
  type WritableDraft,
  type Producer,
  enableMapSet,
  produce,
  freeze,
} from "immer";
import { put, call, takeEvery } from "redux-saga/effects";
import { runSaga, stdChannel, type Task } from "redux-saga";
import type { Flow } from "../../types/flow.types.ts";
import { type FlowNode, ReservedFlowNodeType } from "../../types/node.types.ts";
import { craftTypeBox, validateWithTypebox } from "../validation.ts";
import type { INodeExecutor } from "../node-executors/node-executor.interface.ts";
import { groupBy } from "../../../../helpers/group-by.ts";
import { FlowEventEmitter } from "../event-emitter/event-emitter.ts";
import {
  FlowExecutorState,
  NodeExecutionStatus,
  NodeHandleExecutionStatus,
} from "./executor.types.ts";
import { FlowEventType, FlowEventYield } from "../event/event.types.ts";
import { FlowEvent } from "../event/event.ts";

enableMapSet();

export class FlowExecutor {
  private emitter = new FlowEventEmitter();
  private channel = stdChannel();

  private runningSaga: Task | null = null;
  private nodeDoneWatcherTask: Task | null = null;
  private nodeStartWatcherTask: Task | null = null;
  private nodeHandleValueTransferTask: Task | null = null;
  private executeNodeWatcherTask: Task | null = null;

  private state: FlowExecutorState = {
    isRunning: false,
    flow: {
      id: "",
      nodes: [],
      connections: [],
      externalVariablesSet: [],
    },
    nodeStatusMap: new Map(),
    nodeHandleStatusMap: new Map(),
    nodeHandleValue: new Map(),
  };
  private onStateUpdate: ((state: FlowExecutorState) => void) | undefined;
  private nodeOutputHandleStatusUpdatedHandler: typeof this.channel.put;
  private nodeInputHandleStatusUpdatedHandler: typeof this.channel.put;
  private nodeExecutionStartedHandler: typeof this.channel.put;

  private nodeExecutorMap = new Map<string, INodeExecutor>();

  constructor() {
    this.nodeOutputHandleStatusUpdatedHandler = (...args) =>
      this.channel.put(...args);
    this.nodeInputHandleStatusUpdatedHandler = (...args) =>
      this.channel.put(...args);
    this.nodeExecutionStartedHandler = (...args) => this.channel.put(...args);

    this.init();
  }

  private init() {
    this.emitter.sub(
      FlowEventType.NodeOutputHandleStatusUpdated,
      this.nodeOutputHandleStatusUpdatedHandler,
    );
    this.emitter.sub(
      FlowEventType.NodeInputHandleStatusUpdated,
      this.nodeInputHandleStatusUpdatedHandler,
    );
    this.emitter.sub(
      FlowEventType.NodeExecutionStarted,
      this.nodeExecutionStartedHandler,
    );
  }

  public destroy() {
    this.emitter.unsub(
      FlowEventType.NodeOutputHandleStatusUpdated,
      this.nodeOutputHandleStatusUpdatedHandler,
    );
    this.emitter.unsub(
      FlowEventType.NodeInputHandleStatusUpdated,
      this.nodeInputHandleStatusUpdatedHandler,
    );
    this.emitter.unsub(
      FlowEventType.NodeExecutionStarted,
      this.nodeExecutionStartedHandler,
    );
  }

  public setOnUpdate(callback: (state: FlowExecutorState) => void) {
    this.onStateUpdate = callback;
  }

  private updateState(
    update: (
      draft: WritableDraft<FlowExecutorState>,
    ) => ReturnType<Producer<FlowExecutorState>>,
  ) {
    this.state = produce(this.state, update);

    if (this.onStateUpdate && this.state) {
      this.onStateUpdate(this.state);
    }
  }

  private start(flow: Flow, inputs: Array<unknown>) {
    const nodeStatusMap = new Map<string, NodeExecutionStatus>(
      flow.nodes.map((n) => [n.id, NodeExecutionStatus.Initial]),
    );
    const nodeHandleStatusMap = new Map<string, NodeHandleExecutionStatus>(
      flow.nodes.flatMap((n) =>
        [...n.details.inputs, ...n.details.outputs].flatMap((h) =>
          "id" in h ? [[h.id, NodeHandleExecutionStatus.Initial]] : [],
        ),
      ),
    );

    this.updateState((draft) => {
      draft.isRunning = true;
      draft.flow = freeze({ ...flow });
      draft.nodeStatusMap = nodeStatusMap;
      draft.nodeHandleStatusMap = nodeHandleStatusMap;
      draft.nodeHandleValue = new Map();
    });

    this.runningSaga = runSaga(
      {
        channel: this.channel,
        dispatch: (event) => {
          if (!FlowEvent.isAny(event)) {
            throw new Error(
              "Flow execution saga takes only FlowEvent as a value for dispatch",
            );
          }

          this.emitter.send(event);
        },
        getState: () => {
          return this.state;
        },
      },
      this.saga.bind(this),
      flow,
      inputs,
    );
  }

  private extractStartNode(flow: Flow): FlowNode {
    const startNode = flow.nodes.find(
      (node) => node.details.type === ReservedFlowNodeType.Start,
    );

    if (!startNode || startNode.details.type !== ReservedFlowNodeType.Start) {
      throw new Error("Start node not found");
    }

    return startNode;
  }

  private extractEndNode(flow: Flow): FlowNode {
    const startNode = flow.nodes.find(
      (node) => node.details.type === ReservedFlowNodeType.End,
    );

    if (!startNode || startNode.details.type !== ReservedFlowNodeType.End) {
      throw new Error("End node not found");
    }

    return startNode;
  }

  private extractInitialNodes(flow: Flow): Array<FlowNode> {
    return flow.nodes.filter(
      (node) =>
        node.details.inputs.length === 0 &&
        node.details.type !== ReservedFlowNodeType.Start,
    );
  }

  private *nodeDoneWatcher(
    event: FlowEventYield<FlowEventType.NodeOutputHandleStatusUpdated>,
  ) {
    if (!this.state) {
      throw new Error("Unexpected store state");
    }

    const node = this.state.flow.nodes.find((n) => n.id === event.data.nodeId);
    const nodeHandleStatus = this.state.nodeHandleStatusMap.get(
      event.data.nodeHandleId,
    );

    if (!node) {
      throw new Error("Unknown node");
    }
    if (!nodeHandleStatus) {
      throw new Error("Unknown node status");
    }

    if (nodeHandleStatus !== NodeHandleExecutionStatus.Done) {
      return;
    }

    if (
      node.details.outputs.every(
        (o) =>
          this.state?.nodeHandleStatusMap.get(o.id) ===
          NodeHandleExecutionStatus.Done,
      )
    ) {
      this.updateState((draft) => {
        draft.nodeStatusMap.set(event.data.nodeId, NodeExecutionStatus.Done);
      });
    }
  }

  private *nodeStartWatcher(
    event: FlowEventYield<FlowEventType.NodeInputHandleStatusUpdated>,
  ) {
    if (!this.state) {
      throw new Error("Unexpected store state");
    }

    const node = this.state.flow.nodes.find((n) => n.id === event.data.nodeId);
    const nodeHandleStatus = this.state.nodeHandleStatusMap.get(
      event.data.nodeHandleId,
    );

    if (!node) {
      throw new Error("Unknown node");
    }
    if (!nodeHandleStatus) {
      throw new Error("Unknown node status");
    }

    if (nodeHandleStatus !== NodeHandleExecutionStatus.Done) {
      return;
    }

    if (
      node.details.inputs.every(
        (o) =>
          this.state?.nodeHandleStatusMap.get(o.id) ===
          NodeHandleExecutionStatus.Done,
      )
    ) {
      if (
        this.state.nodeStatusMap.get(event.data.nodeId) ===
        NodeExecutionStatus.Processing
      ) {
        return;
      }

      this.updateState((draft) => {
        draft.nodeStatusMap.set(
          event.data.nodeId,
          NodeExecutionStatus.Processing,
        );
      });

      yield put(
        new FlowEvent(FlowEventType.NodeExecutionStarted, {
          nodeId: event.data.nodeId,
        }),
      );
    }
  }

  private *nodeHandleValueTransfer(
    event: FlowEventYield<FlowEventType.NodeOutputHandleStatusUpdated>,
  ) {
    if (!this.state) {
      throw new Error("Unexpected store state");
    }

    const nodeHandleStatus = this.state.nodeHandleStatusMap.get(
      event.data.nodeHandleId,
    );

    if (!nodeHandleStatus) {
      throw new Error("Unknown node status");
    }

    const nodeConnections = this.state.flow.connections.filter(
      (c) => c.item1HandleId === event.data.nodeHandleId,
    );

    if (!nodeConnections.length) {
      return;
    }

    if (nodeHandleStatus === NodeHandleExecutionStatus.Done) {
      for (const nodeConnection of nodeConnections) {
        this.updateState((draft) => {
          draft.nodeHandleValue.set(
            nodeConnection.item2HandleId,
            event.data.value,
          );
          draft.nodeHandleStatusMap.set(
            nodeConnection.item2HandleId,
            NodeHandleExecutionStatus.Done,
          );
        });

        yield put(
          new FlowEvent(FlowEventType.NodeInputHandleStatusUpdated, {
            value: event.data.value,
            status: "success",
            nodeId: nodeConnection.item2Id,
            nodeHandleId: nodeConnection.item2HandleId,
          }),
        );
      }
    } else if (nodeHandleStatus === NodeHandleExecutionStatus.Processing) {
      for (const nodeConnection of nodeConnections) {
        this.updateState((draft) => {
          draft.nodeHandleStatusMap.set(
            nodeConnection.item2HandleId,
            NodeHandleExecutionStatus.Processing,
          );
        });

        yield put(
          new FlowEvent(FlowEventType.NodeInputHandleStatusUpdated, {
            value: event.data.value,
            status: "processing",
            nodeId: nodeConnection.item2Id,
            nodeHandleId: nodeConnection.item2HandleId,
          }),
        );
      }
    }
  }

  // TODO: do handle error sagas

  public registerNodeExecutor(nodeType: string, executor: INodeExecutor) {
    const reservedNodeTypes = Object.values<string>(ReservedFlowNodeType);

    if (reservedNodeTypes.includes(nodeType)) {
      throw new Error(
        `Attempt to use reserved node type. Reserved types: [${reservedNodeTypes.join(", ")}]`,
      );
    }

    this.nodeExecutorMap.set(nodeType, executor);

    return this;
  }

  private pickNodeExecutor(node: FlowNode): INodeExecutor {
    if (
      node.details.type === ReservedFlowNodeType.End ||
      node.details.type === ReservedFlowNodeType.Start
    ) {
      return function* () {
        return [];
      };
    }

    const executor = this.nodeExecutorMap.get(node.details.type);

    if (executor) {
      return executor;
    }

    throw new Error(`Node executor is not implemented: ${node.details.type}`);
  }

  private *executeNodeWatcher(
    event: FlowEventYield<FlowEventType.NodeExecutionStarted>,
  ) {
    if (!this.state) {
      throw new Error("Unexpected store state");
    }

    const node = this.state.flow.nodes.find((n) => n.id === event.data.nodeId);

    if (!node) {
      throw new Error("Unknown node");
    }

    const nodeInputValues = node.details.inputs.map((i) => {
      return this.state?.nodeHandleValue.get(i.id);
    });

    this.validateNode(node, nodeInputValues, "input");

    if (node.details.type === ReservedFlowNodeType.End) {
      this.updateState((draft) => {
        draft.nodeStatusMap.set(event.data.nodeId, NodeExecutionStatus.Done);
      });
      yield call(this.stop.bind(this));
    }

    const executor = this.pickNodeExecutor(node);
    const outputs = yield* executor(node, nodeInputValues);

    this.validateNode(node, outputs, "output");

    for (const index of outputs.keys()) {
      const output = outputs[index];

      this.updateState((draft) => {
        draft.nodeHandleStatusMap.set(
          node.details.outputs[index].id,
          NodeHandleExecutionStatus.Done,
        );
      });

      yield put(
        new FlowEvent(FlowEventType.NodeOutputHandleStatusUpdated, {
          value: output,
          status: "success",
          nodeId: node.id,
          nodeHandleId: node.details.outputs[index].id,
        }),
      );
    }
  }

  private *saga(flow: Flow, inputs: Array<unknown>): Generator {
    // Note: event sync flow has to be treated as async one
    yield new Promise((resolve) => setTimeout(resolve, 0));

    if (!this.state) {
      throw new Error("Unexpected store state");
    }

    this.nodeDoneWatcherTask = (yield takeEvery<
      FlowEvent<FlowEventType.NodeOutputHandleStatusUpdated>
    >(
      FlowEventType.NodeOutputHandleStatusUpdated,
      this.nodeDoneWatcher.bind(this),
    )) as Task;
    this.nodeStartWatcherTask = (yield takeEvery<
      FlowEvent<FlowEventType.NodeInputHandleStatusUpdated>
    >(
      FlowEventType.NodeInputHandleStatusUpdated,
      this.nodeStartWatcher.bind(this),
    )) as Task;
    this.nodeHandleValueTransferTask = (yield takeEvery<
      FlowEvent<FlowEventType.NodeOutputHandleStatusUpdated>
    >(
      FlowEventType.NodeOutputHandleStatusUpdated,
      this.nodeHandleValueTransfer.bind(this),
    )) as Task;
    this.executeNodeWatcherTask = (yield takeEvery<
      FlowEvent<FlowEventType.NodeExecutionStarted>
    >(
      FlowEventType.NodeExecutionStarted,
      this.executeNodeWatcher.bind(this),
    )) as Task;

    const startNode = this.extractStartNode(flow);
    const initialNodes = this.extractInitialNodes(flow);

    for (const index of startNode.details.outputs.keys()) {
      const output = startNode.details.outputs[index];

      this.updateState((draft) => {
        draft.nodeHandleStatusMap.set(
          output.id,
          NodeHandleExecutionStatus.Done,
        );
      });

      yield put(
        new FlowEvent(FlowEventType.NodeOutputHandleStatusUpdated, {
          value: inputs[index],
          status: "success",
          nodeId: startNode.id,
          nodeHandleId: output.id,
        }),
      );
    }
    for (const initialNode of initialNodes) {
      this.updateState((draft) => {
        draft.nodeStatusMap.set(initialNode.id, NodeExecutionStatus.Processing);
      });

      yield put(
        new FlowEvent(FlowEventType.NodeExecutionStarted, {
          nodeId: initialNode.id,
        }),
      );
      // this.updateState((draft) => {
      //   draft.nodeHandleStatusMap.set(
      //     initialNode.details.outputs[0].id,
      //     NodeHandleExecutionStatus.Done,
      //   );
      // });
      //
      // yield put(
      //   new FlowEvent(FlowEventType.NodeOutputHandleStatusUpdated, {
      //     value: initialNode.details.body.value,
      //     status: "success",
      //     nodeId: initialNode.id,
      //     nodeHandleId: initialNode.details.outputs[0].id,
      //   }),
      // );
    }
  }

  private validateNode(
    node: FlowNode,
    values: Array<unknown>,
    type: "input" | "output",
  ) {
    const { outputSchemas, inputSchemas } = craftTypeBox(node.details);

    const schemas = type === "input" ? inputSchemas : outputSchemas;

    // TODO: instead of throw call execution error callback or smth (error is a valid behavior here)
    if (values.length !== schemas.length) {
      throw new Error("Invalid input");
    }

    const isInputsValid = schemas.every((is, i) =>
      validateWithTypebox(is, values[i]),
    );

    if (!isInputsValid) {
      throw new Error("Invalid input");
    }

    return true;
  }

  // TODO: do advance validation for handles + check for loops
  private validateFlowStructure(flow: Flow) {
    const endNode = this.extractEndNode(flow);
    const endNodeConnections = flow.connections.filter(
      (c) => c.item2Id === endNode.id,
    );
    const endNodeConnectionsGrouped = groupBy(
      endNodeConnections,
      (c) => c.item2HandleId,
    );

    const hasDisconnectedEndNodeInputs = endNode.details.inputs.some(
      (i) => !endNodeConnectionsGrouped[i.id],
    );

    if (hasDisconnectedEndNodeInputs) {
      throw new Error("Invalid flow structure");
    }
  }

  public execute(flow: Flow, inputs: Array<unknown>) {
    if (this.state?.isRunning) {
      throw new Error("Flow already running");
    }

    this.validateFlowStructure(flow);

    const startNode = this.extractStartNode(flow);

    this.validateNode(startNode, inputs, "output");

    this.start(flow, inputs);
  }

  private stop() {
    if (this.state) {
      this.updateState((draft) => {
        draft.isRunning = false;
      });
    }

    this.nodeDoneWatcherTask?.cancel();
    this.nodeStartWatcherTask?.cancel();
    this.nodeHandleValueTransferTask?.cancel();
    this.executeNodeWatcherTask?.cancel();
  }

  public cancel() {
    this.stop();

    if (this.runningSaga?.isRunning()) {
      this.runningSaga?.cancel();
    }
  }
}
