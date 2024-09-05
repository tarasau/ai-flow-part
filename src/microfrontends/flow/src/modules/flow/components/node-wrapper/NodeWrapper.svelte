<style>
    .start-wrapper {
        background: antiquewhite;
        min-height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
    }
    .node-label {
        position: absolute;
        top: -10px;
        left: auto;
        border: 1px solid black;
        border-radius: 10px;
        background: floralwhite;
        padding: 0 6px;
    }
</style>

<script lang="ts">
    import {type Node, useNodesData} from "@xyflow/svelte";
    import type {NodeData} from "../../../shared/types/flow/flow.types";
    import {derived, type Writable} from "svelte/store";
    import {getContext} from "svelte";
    import {
      type FlowExecutorState,
      NodeExecutionStatus,
    } from '@shared/modules/flow/execution/executor/executor.types.ts';

    export let label: string;
    export let nodeId: string;
    export let noPadding: boolean = false;

    const flowExecutionState = getContext<Writable<FlowExecutorState | undefined>>('flowExecutionState');

    const nodeData = useNodesData<Node<NodeData>>([nodeId]);
    const outputs = derived(nodeData, $nodeData => $nodeData.at(0)?.data.details.outputs||[]);
    const inputs = derived(nodeData, $nodeData => $nodeData.at(0)?.data.details.inputs||[]);

    const color = derived(flowExecutionState, ($flowExecutionState) => {
        const nodeStatus = $flowExecutionState?.nodeStatusMap.get(nodeId);

        switch (nodeStatus) {
            case NodeExecutionStatus.Initial:
                return 'darkgray';
            case NodeExecutionStatus.Processing:
                return 'blue';
            case NodeExecutionStatus.Done:
                return 'green';
            default:
                return 'lightgray';
        }
    });
</script>

<div
        class="start-wrapper"
        style:min-height="{Math.max($outputs.length, $inputs.length) * 30 + 20}px"
        style:border="4px solid {$color}"
        style:padding="{noPadding ? '' : '10px 80px'}"
>
    <div class="node-label">
        <strong>{label}</strong>
    </div>
    <slot/>
</div>
