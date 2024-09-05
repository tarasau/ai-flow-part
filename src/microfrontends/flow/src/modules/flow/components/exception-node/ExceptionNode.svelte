<script lang="ts">
    import {type NodeProps, useUpdateNodeInternals} from '@xyflow/svelte';
    import NodeWrapper from "../node-wrapper/NodeWrapper.svelte";
    import type {NodeController, NodeData} from "../../../shared/types/flow/flow.types";
    import NodeInputs from "../node-inputs/NodeInputs.svelte";
    import NodeOutputs from "../node-outputs/NodeOutputs.svelte";
    import {getContext} from "svelte";

    export let id: string;
    export let data: NodeData;

    const nodeController = getContext<NodeController>('nodeController');

    const updateNodeInternals = useUpdateNodeInternals();

    function handleClick(event: MouseEvent) {
        nodeController.addInput(id)
        updateNodeInternals(id)
    }
    // TODO: finalize const then do ERROR BLOCK with signal + error handling for all the implemented stuff (nodes + flow execution)
    // TODO: implement proper serialization service to re-use it across blocks
    // TODO: add ability to save mock for blocks, this way user would be able to see block value at any time as a preview

    // Note: avoid compiler warning for unregistered props
    $$restProps;
    type $$Props = NodeProps;
</script>

<NodeWrapper label={data.label} nodeId={id}>
    <NodeInputs nodeId={id} />
    <NodeOutputs nodeId={id} />
<!--    // TODO: do input for error message -->
    <button on:click={handleClick}>>Add</button>
</NodeWrapper>
