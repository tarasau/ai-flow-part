<style>
    .node-output-handle-label {
        position: absolute;
        right: 10px;
        margin-top: -12px;
        background: #747bff;
    }
</style>

<script lang="ts">
    import {Handle, type Node, Position, useNodesData} from '@xyflow/svelte';
    import type {NodeData} from "../../../shared/types/flow/flow.types";
    import {derived} from "svelte/store";

    export let nodeId: string;

    const nodeData = useNodesData<Node<NodeData>>([nodeId]);
    const outputs = derived(nodeData, $nodeData => $nodeData.at(0)?.data.details.outputs||[]);
</script>

{#each $outputs as output, index}
    <div>
        <Handle
                id={output.id}
                type="source"
                position={Position.Right}
                style="top: {30*(index + 1)}px; background: #555;"
        />
        <div class="node-output-handle-label"
             style="top: {30*(index + 1)}px;"
        >
            {output.type}
        </div>
    </div>
{/each}
