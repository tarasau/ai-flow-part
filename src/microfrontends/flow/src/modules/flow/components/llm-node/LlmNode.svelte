<script lang="ts">
    import {type NodeProps} from '@xyflow/svelte';
    import NodeWrapper from "../node-wrapper/NodeWrapper.svelte";
    import type {NodeData} from "../../../shared/types/flow/flow.types";
    import NodeOutputs from "../node-outputs/NodeOutputs.svelte";
    import NodeInputs from "../node-inputs/NodeInputs.svelte";
    import Input from "../../../../components/input/Input.svelte";
    import { bodySchema } from '../../../../../../../shared/modules/flow/execution/node-executors/llm.ts';

    export let id: string;
    export let data: NodeData;

    let prompt: string;
    if (!bodySchema.Check(data.details.body)) {
      throw new Error("Unexpected body format");
    }
    prompt = data.details.body.prompt;

    // Note: avoid compiler warning for unregistered props
    $$restProps;
    type $$Props = NodeProps;
</script>

<NodeWrapper label={data.label} nodeId={id}>
    <NodeInputs nodeId={id}/>
    <NodeOutputs nodeId={id}/>
    {#if data.details.type === 'llm'}
        <Input
                label="Prompt"
                component="textarea"
                height="100px"
                bind:value={prompt}
        />
    {/if}
</NodeWrapper>
