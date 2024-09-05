<script lang="ts">
    import {type NodeProps, useUpdateNodeInternals} from '@xyflow/svelte';
    import NodeWrapper from "../node-wrapper/NodeWrapper.svelte";
    import type {NodeController, NodeData} from "../../../shared/types/flow/flow.types";
    import NodeOutputs from "../node-outputs/NodeOutputs.svelte";
    import NodeInputs from "../node-inputs/NodeInputs.svelte";
    import Select from "../../../../components/select/Select.svelte";
    import {DataItemType} from "../../../../../../../shared/modules/flow/types/data.types.ts";
    import Input from "../../../../components/input/Input.svelte";
    import {writable} from "svelte/store";
    import {getContext} from "svelte";
    import { bodySchema } from '../../../../../../../shared/modules/flow/execution/node-executors/const.ts';

    export let id: string;
    export let data: NodeData;

    const valueFromString = (valueString: string) => {
          if (data.details.type !== 'const') {
                throw new Error('Unexpected node type');
            }
      if (!bodySchema.Check(data.details.body)) {
        throw new Error("Unexpected body format");
      }


        if (data.details.body.type.type === DataItemType.Object || data.details.body.type.type === DataItemType.Array) {
            return JSON.parse(valueString);
        }
        if (data.details.body.type.type === DataItemType.Number) {
            return parseFloat(valueString);
        }
        if (data.details.body.type.type === DataItemType.Null) {
            return null;
        }
        if (data.details.body.type.type === DataItemType.String) {
            return valueString;
        }
        if (data.details.body.type.type === DataItemType.Boolean) {
            return valueString === 'true';
        }
        if (data.details.body.type.type === DataItemType.Signal) {
            return Symbol(valueString);
        }

        throw new Error('Unexpected const node type');
    };
    const valueToString = (value: unknown): string => {
        if (data.details.type !== 'const') {
            throw new Error('Unexpected node type');
        }
      if (!bodySchema.Check(data.details.body)) {
        throw new Error("Unexpected body format");
      }

        if (data.details.body.type.type === DataItemType.Object || data.details.body.type.type === DataItemType.Array) {
            return JSON.stringify(value);
        }
        if (data.details.body.type.type === DataItemType.Number) {
            return value.toString();
        }
        if (data.details.body.type.type === DataItemType.Null) {
            return 'null';
        }
        if (data.details.body.type.type === DataItemType.String) {
            return value;
        }
        if (data.details.body.type.type === DataItemType.Boolean) {
            return value ? 'true' : 'false';
        }
        if (data.details.body.type.type === DataItemType.Signal) {
            return '';
        }

        throw new Error('Unexpected const node type');
    };

    if (data.details.type !== 'const') {
        throw new Error('Unexpected node type');
    }

    if (!bodySchema.Check(data.details.body)) {
      throw new Error("Unexpected body format");
    }

    const nodeController = getContext<NodeController>('nodeController');
    const updateNodeInternals = useUpdateNodeInternals();

    const value = writable(valueToString(data.details.body.value));
    const type = writable(data.details.body.type);

    value.subscribe((v) => {
        if (data.details.type === 'const') {
          if (!bodySchema.Check(data.details.body)) {
            throw new Error("Unexpected body format");
          }

          data.details.body.value = valueFromString(v);
        }
    });
    // type.subscribe((t) => {
    //     if (data.details.type === FlowNodeType.Const) {
    //         data.details.body.type = t;
    //         data.details.body.value = valueFromString($value);
    //
    //         nodeController.updateOutput(
    //             id,
    //             createDataItem(
    //                 data.details.outputs.at(0).id,
    //                 data.details.body.type,
    //                 data.details.body.type === DataItemType.Array
    //                     ? { itemType: {type: DataItemType.String, id: uuid()} }
    //                     : (
    //                         data.details.body.type === DataItemType.Object
    //                             ? { structure: {} }
    //                             : undefined
    //                     )
    //             ));
    //         updateNodeInternals(id);
    //     }
    // });

    // Note: avoid compiler warning for unregistered props
    $$restProps;
    type $$Props = NodeProps;
</script>

<NodeWrapper label={data.label} nodeId={id}>
    <NodeInputs nodeId={id}/>
    <NodeOutputs nodeId={id}/>
    {#if data.details.type === 'const'}
        <Select
                label="Type"
                bind:value={$type}
        >
            {#each Object.values(DataItemType) as type}
                <option value={type}>{type}</option>
            {/each}
        </Select>
<!--        <Input-->
<!--                label="Value"-->
<!--                component="textarea"-->
<!--                height="100px"-->
<!--                bind:value={data.details.body.value}-->
<!--        />-->
        <Input
                label="Value"
                component="textarea"
                height="100px"
                bind:value={$value}
        />
    {/if}
</NodeWrapper>
