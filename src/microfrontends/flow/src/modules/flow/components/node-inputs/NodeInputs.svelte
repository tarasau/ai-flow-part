<style>
    .node-input-handle-label {
        position: absolute;
        left: 10px;
        margin-top: -10px;
        background: #b1b1b7;
    }
    :global(.svelte-flow .svelte-flow__handle) {
        background: #91919a;
        padding: 4px;
    }
    :global(.svelte-flow .svelte-flow__handle.connectingto) {
        background: #ff6060;
    }
    :global(.svelte-flow .svelte-flow__handle.valid) {
        background: #55dd99;
    }
</style>

<script lang="ts">
    import {getContext} from "svelte";
    import {derived, type Readable, type Writable} from "svelte/store";
    import {Handle, Position, useNodesData, type Node} from '@xyflow/svelte';
    import type {NodeData} from "../../../shared/types/flow/flow.types";
    import {
      type FlowExecutorState,
      NodeHandleExecutionStatus,
    } from '@shared/modules/flow/execution/executor/executor.types.ts';

    export let nodeId: string;

    const nodeData = useNodesData<Node<NodeData>>([nodeId]);
    const inputs = derived(nodeData, $nodeData => $nodeData.at(0)?.data.details.inputs || []);

    const edgesTargetMap = getContext<Readable<{ [p: string]: boolean }>>('edgesTargetMap');

    const flowExecutionState = getContext<Writable<FlowExecutorState | undefined>>('flowExecutionState');

    const colorMap = derived([flowExecutionState, inputs], ([$flowExecutionState, $inputs]) => {
        return $inputs.reduce<Map<string, 'darkgray' | 'blue' | 'green'>>((acc, input) => {
            const handleStatus = $flowExecutionState?.nodeHandleStatusMap.get(input.id);

            switch (handleStatus) {
                case NodeHandleExecutionStatus.Initial:
                    acc.set(input.id, 'darkgray');
                    break;
                case NodeHandleExecutionStatus.Processing:
                    acc.set(input.id, 'blue');
                    break;
                case NodeHandleExecutionStatus.Done:
                    acc.set(input.id, 'green');
                    break;
                default:
                    acc.set(input.id, 'darkgray');
                    break;
            }

            return acc;
        }, new Map());
    });
</script>

{#each $inputs as input, index}
    <div>
        <Handle
                id={input.id}
                isConnectable={!$edgesTargetMap[input.id]}
                type="target"
                position={Position.Left}
                style="top: {30*(index + 1)}px;background: {$colorMap.get(input.id)}"
        />
        <div class="node-input-handle-label"
                style="top: {30*(index + 1)}px;"
        >
            {input.type}
        </div>
    </div>
{/each}
