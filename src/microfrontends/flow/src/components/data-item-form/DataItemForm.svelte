<style>
    .fieldset > * {
        display: block;
    }

    .fieldset > :global(:not(legend) + *) {
        margin-top: 16px;
    }

    .fieldset {
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 20px;
    }
</style>

<script lang="ts">
    import {type DataItem, DataItemType} from "../../../../../shared/modules/flow/types/data.types.ts";
    import {v4 as uuid} from "uuid";
    import DataItemFormFields from "./DataItemFormFields.svelte";

    export let data: DataItem = ({
        id: '',
        type: DataItemType.String,
        // itemType: undefined,
        // structure: undefined,
    });
    export let onSubmit = (result: DataItem) => {

    };

    // let id = uuid();
    // let type = data.type;
    // let itemType: DataItem | undefined = undefined;
    // let structure: Record<string, DataItem> | undefined = undefined;
    // let errors = {
    //     type: '',
    //     itemType: '',
    //     structure: '',
    // };
    // let touchedFields = {
    //     type: false,
    //     itemType: false,
    //     structure: false,
    // };

    // $: result = {
    //     id, type, itemType, structure
    // };

    // $: errors = validate($data);
    //
    // const validate = (itemType: DataItem) => {
    //     const newErrors = {} as typeof errors;
    //
    //     if (touchedFields.type && !type) {
    //         newErrors.type = 'Type is required';
    //     }
    //     if (touchedFields.itemType && (!itemType || !Object.keys(validate(itemType)).length)) {
    //         newErrors.itemType = 'Item type is required';
    //     }
    //     if (touchedFields.structure && !structure) {
    //         newErrors.type = 'Structure is required';
    //     }
    //
    //     return errors;
    // };

    const validateAndSubmit = () => {
        // touchedFields = {
        //     type: true,
        //     itemType: true,
        //     structure: true
        // };

        // if (!Object.keys(errors).length) {
        //     if (result.type === DataItemType.Array && itemType) {
        //         onSubmit(createDataItem(result.id, result.type, { itemType }));
        //     } else if (result.type === DataItemType.Object && structure) {
        //         onSubmit(createDataItem(result.id, result.type, {structure}));
        //     } else {
        //         onSubmit(createDataItem(result.id, result.type, undefined));
        //     }
        // }
    };
</script>

<div class="form">
<!--    <fieldset class="fieldset">-->
<!--        <legend>form</legend>-->
<!--        <DataItemFormFields bind:data={data} />-->

<!--        <Select-->
<!--                label="Type"-->
<!--                bind:value={type}-->
<!--                on:blur={() => touchedFields.type = true}-->
<!--                error={errors.type}-->
<!--        >-->
<!--            {#each Object.values(DataItemType) as dataItemType}-->
<!--                <option value={dataItemType}>{dataItemType}</option>-->
<!--            {/each}-->
<!--        </Select>-->
<!--        {#if type === DataItemType.Array}-->
<!--            <svelte:self data={} />-->
<!--        {/if}-->

<!--        <button on:click={validateAndSubmit}>Submit22</button>-->
<!--    </fieldset>-->
</div>
