<script lang="ts">
    import {type NodeProps} from '@xyflow/svelte';
    import NodeWrapper from "../node-wrapper/NodeWrapper.svelte";
    import type {NodeData} from "../../../shared/types/flow/flow.types";
    import NodeOutputs from "../node-outputs/NodeOutputs.svelte";
    import NodeInputs from "../node-inputs/NodeInputs.svelte";
    import Select from "../../../../components/select/Select.svelte";
    import {
      ComparisonFlowNodeOperator
    } from '../../../../../../../shared/modules/flow/execution/node-executors/comparison.ts';
    
    export let id: string;
    export let data: NodeData;

    // Note: avoid compiler warning for unregistered props
    $$restProps;
    type $$Props = NodeProps;
</script>

<NodeWrapper label={data.label} nodeId={id}>
    <NodeInputs nodeId={id}/>
    <NodeOutputs nodeId={id}/>
    {#if data.details.type === 'comparison'}
        <Select
                label="Type"
                bind:value={data.details.body.operator}
        >
            {#each Object.values(ComparisonFlowNodeOperator) as operator}
                <option value={operator}>{operator}</option>
            {/each}
        </Select>
    {/if}
</NodeWrapper>
