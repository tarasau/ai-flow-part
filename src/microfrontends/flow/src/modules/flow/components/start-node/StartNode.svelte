<script lang="ts">
    import {type NodeProps, useUpdateNodeInternals} from '@xyflow/svelte';
    import NodeWrapper from "../node-wrapper/NodeWrapper.svelte";
    import type {NodeController, NodeData} from "../../../shared/types/flow/flow.types";
    import NodeOutputs from "../node-outputs/NodeOutputs.svelte";
    import NodeInputs from "../node-inputs/NodeInputs.svelte";
    import {getContext} from "svelte";
    import Modal, {getModal} from "../../../../components/modal/Modal.svelte";
    import {type DataItem} from "../../../../../../../shared/modules/flow/types/data.types.ts";
    import DataItemForm from "../../../../components/data-item-form/DataItemForm.svelte";

    export let id: string;
    export let data: NodeData;

    const nodeController = getContext<NodeController>('nodeController');

    const updateNodeInternals = useUpdateNodeInternals();

    // function handleClick(event: MouseEvent) {
    //     nodeController.addOutput(id, createDataItem(uuid(), DataItemType.Infer, undefined));
    //     updateNodeInternals(id);
    // }

    // function onResolve(sel: DataItemType) {
    //     if (sel === DataItemType.Array) {
    //         nodeController.addOutput(id, createDataItem(uuid(), sel, {
    //             itemType: {
    //                 id: '',
    //                 type: DataItemType.Boolean,
    //             }
    //         }));
    //     } else if (sel === DataItemType.Object) {
    //         nodeController.addOutput(id, createDataItem(uuid(), sel, {structure: {}}));
    //     } else {
    //         nodeController.addOutput(id, createDataItem(uuid(), sel, undefined));
    //     }
    //     updateNodeInternals(id);
    // }

    let dataItem: DataItem;

    // Note: avoid compiler warning for unregistered props
    $$restProps;
    type $$Props = NodeProps;
</script>

<NodeWrapper label={data.label} nodeId={id}>
    <NodeInputs nodeId={id}/>
    <NodeOutputs nodeId={id}/>

<!--    <button on:click={handleClick}>>Add</button>-->

<!--    <button on:click={()=>getModal('selection').open(onResolve)}>-->
<!--        Open First Popup-->
<!--    </button>-->
</NodeWrapper>

<!-- the modal without an `id` -->
<Modal id="selection">
    <h1>Hello!</h1>
<!--    <select id="types" bind:value={dataItem}>-->
<!--        {#each Object.values(DataItemType) as dataItemType}-->
<!--            <option value={dataItemType}>{dataItemType}</option>-->
<!--        {/each}-->
<!--    </select>-->
    <DataItemForm data={dataItem} onSubmit={()=>getModal('selection').close(dataItem)} />
    <button on:click={()=>getModal('selection').close(dataItem)}>
        Submit
    </button>
</Modal>