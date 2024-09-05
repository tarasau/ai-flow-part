<script lang="ts">
    import { derived, writable } from "svelte/store";
    import {
        Background,
        Controls,
        type Edge,
        type IsValidConnection,
        MiniMap,
        type Node,
        SvelteFlow,
    } from "@xyflow/svelte";

    import "@xyflow/svelte/dist/base.css";
    import { MessagingService } from "../../../shared/messaging/messaging.service";
    import { FlowInitiationRequested } from "../../../shared/messaging/events/flow-initiation-requested/flow-initiation-requested.event";
    import type { Flow } from "../../../shared/modules/flow/types/flow.types.ts";
    import { flowToEdges } from "./modules/shared/mappers/flow/flow-to-edges";
    import { flowToNodes } from "./modules/shared/mappers/flow/flow-to-nodes";
    import { onDestroy, onMount, setContext } from "svelte";
    import { DataItemType } from "../../../shared/modules/flow/types/data.types.ts";
    import { FlowInitiationComplete } from "../../../shared/messaging/events/flow-initiation-complete/flow-initiation-complete.event";
    import StartNode from "./modules/flow/components/start-node/StartNode.svelte";
    import type {
        NodeController,
        NodeData,
    } from "./modules/shared/types/flow/flow.types";
    import EndNode from "./modules/flow/components/end-node/EndNode.svelte";
    import { groupBy } from "../../../shared/helpers/group-by";
    import ComparisonNode from "./modules/flow/components/comparison-node/ComparisonNode.svelte";
    import { v4 as uuid } from "uuid";
    import LlmNode from "./modules/flow/components/llm-node/LlmNode.svelte";
    import ConstNode from "./modules/flow/components/const-node/ConstNode.svelte";
    import {
        MessagingEventType,
        MessagingSlice,
    } from "../../../shared/messaging/messaging.types.ts";
    import { FlowMountingDone } from "../../../shared/messaging/events/flow-mounting-done/flow-mounting-done.event.ts";
    import { FlowExecutionStateUpdated } from "../../../shared/messaging/events/flow-execution-state-updated/flow-execution-state-updated.event.ts";
    import { type FlowNode, ReservedFlowNodeType } from '../../../shared/modules/flow/types/node.types.ts';
    import type { FlowExecutorState } from '../../../shared/modules/flow/execution/executor/executor.types.ts';
    import CustomNode from './modules/flow/components/custom-node/CustomNode.svelte';
    import {
      FlowPluginsInjectionRequested
    } from '@shared/messaging/events/flow-plugins-injection-requested/flow-plugins-injection-requested.event.ts';
    import type { FlowPlugin } from '@shared/modules/flow/types/plugin.types.ts';

    const nodeTypes = {
        start: StartNode,
        end: EndNode,
        comparison: ComparisonNode,
        llm: LlmNode,
        const: ConstNode,
        custom: CustomNode,
        default: CustomNode,
    };

    // const initialFlow: Flow = {
    //     connections: [],
    //     nodes: [],
    //     id: '',
    //     externalVariablesSet: [],
    // };
    const initialFlow: Flow = {
        connections: [],
        nodes: [
            {
                id: "1",
                name: "Start",
                type: ReservedFlowNodeType.Start,
                position: { x: -200, y: -200 },
                details: {
                    type: ReservedFlowNodeType.Start,
                    body: null,
                    inputs: [],
                    outputs: [
                        {
                            id: "o1",
                            type: DataItemType.String,
                        },
                    ],
                },
            },
            {
                id: "2",
                name: "End",
                type: ReservedFlowNodeType.End,
                position: { x: 500, y: -200 },
                details: {
                    type: ReservedFlowNodeType.End,
                    body: null,
                    outputs: [],
                    inputs: [
                        {
                            id: "i1",
                            type: DataItemType.Infer,
                        },
                        {
                            id: "i5",
                            type: DataItemType.Infer,
                        },
                        {
                            id: "i9",
                            type: DataItemType.Infer,
                        },
                    ],
                },
            },
        ],
        id: "",
        externalVariablesSet: [],
    };

    const plugins = writable<Array<FlowPlugin>>([]);
    const pluginsMap = derived(plugins, ($plugins) =>
      groupBy(
        $plugins,
        p => p.id,
      ),
    );

    setContext("pluginsMap", pluginsMap);

    const flow = writable<Flow>(initialFlow);
    const nodes = writable<Array<Node<NodeData>>>(flowToNodes(initialFlow));
    const edges = writable<Array<Edge>>(flowToEdges(initialFlow));

    flow.subscribe((flowData) => {
        nodes.set(flowToNodes(flowData));
        edges.set(flowToEdges(flowData));
    });

    const inputHandlesMap = derived(nodes, ($nodes) =>
        groupBy(
            $nodes.flatMap<FlowNode['details']["inputs"][0]>(
                (node) => node.data.details.inputs,
            ),
            (edge) => edge!.id,
        ),
    );
    const outputHandlesMap = derived(nodes, ($nodes) =>
        groupBy(
            $nodes.flatMap<FlowNode['details']["outputs"][0]>(
                (node) => node.data.details.outputs,
            ),
            (edge) => edge!.id,
        ),
    );

    const edgesTargetMap = derived(edges, ($edges) =>
        groupBy(
            $edges,
            (edge) => edge.targetHandle || "",
            false,
            () => true,
        ),
    );

    setContext("edgesTargetMap", edgesTargetMap);
    // setContext('nodesIndexMap', )
    setContext<NodeController>("nodeController", {
        addInput(nodeId: string) {
            nodes.update((ns) =>
                ns.map((n) =>
                    n.id === nodeId
                        ? {
                              ...n,
                              data: {
                                  ...n.data,
                                  details: {
                                      ...n.data.details,
                                      inputs: [
                                          ...n.data.details.inputs,
                                          {
                                              id: uuid(),
                                              type: DataItemType.Infer,
                                          },
                                      ],
                                  },
                              },
                          }
                        : n,
                ),
            );
        },
        addOutput(nodeId, item) {
            nodes.update((ns) =>
                ns.map((n) =>
                    n.id === nodeId
                        ? {
                              ...n,
                              data: {
                                  ...n.data,
                                  details: {
                                      ...n.data.details,
                                      outputs: [
                                          ...n.data.details.outputs,
                                          item,
                                      ],
                                  },
                              },
                          }
                        : n,
                ),
            );
        },
        updateOutput(nodeId, item) {
            nodes.update((ns) =>
                ns.map((n) =>
                    n.id === nodeId
                        ? {
                              ...n,
                              data: {
                                  ...n.data,
                                  details: {
                                      ...n.data.details,
                                      outputs: [
                                          ...n.data.details.outputs.filter(
                                              (o) => o.id !== item.id,
                                          ),
                                          item,
                                      ],
                                  },
                              },
                          }
                        : n,
                ),
            );
        },
    });

    const isValidConnection: IsValidConnection = (connection) => {
        if (!connection.targetHandle || !connection.sourceHandle) {
            return false;
        }

        const into = $inputHandlesMap[connection.targetHandle];
        const from = $outputHandlesMap[connection.sourceHandle];

        if (!into || !from) {
            return false;
        }

        return from.type === into.type || into.type === DataItemType.Infer;
    };

    const isSameOrigin = import.meta.env.PROD;

    const messagingService = new MessagingService(
        MessagingSlice.Flow,
        MessagingSlice.App,
        isSameOrigin,
        window,
        isSameOrigin ? window : window.parent,
        isSameOrigin ? undefined : import.meta.env.VITE_APP_URI,
    );

    const flowInitiationRequestedHandler = (e: FlowInitiationRequested) => {
        flow.set(e.data.value);
        messagingService.send(new FlowInitiationComplete({ id: $flow.id }));
    };

    const flowPluginsInjectionRequestedHandler = (e: FlowPluginsInjectionRequested) => {
        plugins.set(e.data.value);
    };

    const flowExecutionStateUpdatedHandler = (e: FlowExecutionStateUpdated) => {
        flowExecutionState.set(e.data.state);
    };

    const flowExecutionState = writable<FlowExecutorState>();

    setContext("flowExecutionState", flowExecutionState);

    const startHandler = () => {
        // flowExecutor.execute(nodesAndEdgesToFlow($nodes, $edges, $flow), ['Elf']);
    };

    onMount(() => {
        messagingService.sub(
            MessagingEventType.FlowExecutionStateUpdated,
            flowExecutionStateUpdatedHandler,
        );
        messagingService.sub(
            MessagingEventType.FlowInitiationRequested,
            flowInitiationRequestedHandler,
        );
        messagingService.sub(
            MessagingEventType.FlowPluginsInjectionRequested,
            flowPluginsInjectionRequestedHandler,
        );

        messagingService.send(new FlowMountingDone({}));
    });
    onDestroy(() => {
        messagingService.unsub(
            MessagingEventType.FlowExecutionStateUpdated,
            flowExecutionStateUpdatedHandler,
        );
        messagingService.unsub(
            MessagingEventType.FlowInitiationRequested,
            flowInitiationRequestedHandler,
        );
        messagingService.unsub(
            MessagingEventType.FlowPluginsInjectionRequested,
            flowPluginsInjectionRequestedHandler,
        );
    });
</script>

<div style:height="100%" style:width="100%">
    <button on:click={startHandler} style="position: absolute;z-index: 9999"
        >TEST</button
    >
    <!--    <pre style:position="absolute" style:left="50px" style:z-index="1">{JSON.stringify($flowExecutionState, null, 4)}</pre>-->
    <SvelteFlow
        {nodes}
        {edges}
        {nodeTypes}
        {isValidConnection}
        deleteKey={["Delete", "Backspace"]}
        fitView
    >
        <Controls />
        <Background />
        <MiniMap />
    </SvelteFlow>
</div>
