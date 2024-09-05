<style>
    .form-field-object-field {
        display: flex;
        gap: 10px;
    }
</style>

<script lang="ts">
    import Select from '../select/Select.svelte';
    import {type DataItem, DataItemType} from "../../../../../shared/modules/flow/types/data.types.ts";
    import {v4 as uuid} from "uuid";
    import Input from "../input/Input.svelte";

    export let data: DataItem;
    // export let data: DataItem = {
    //     id: '',
    //     type: DataItemType.String,
    //     // itemType: undefined,
    //     // structure: undefined,
    // };

    let id = uuid();
    let errors: {
        type?: string,
        itemType?: string,
        structure?: string,

    } = {};
    let touchedFields = {
        type: false,
        itemType: false,
        structure: false,
    };

    // $: result = {
    //     id, type, itemType, structure
    // };

    const addField = () => {
        if (data.type !== DataItemType.Object) {
            return;
        }

        let key = 1;
        for (let i = 1; i < 101; i++) {
            if (!(data.structure || {})[i]) {
                key = i;
                break;
            }
        }
        if (key === 101) {
            // TODO: add popup that states that max number is 100
            return;
        }
        // data = ({
        //         ...data,
        //         structure: {
        //             ...(data.structure || {}),
        //             [key]: {
        //                 id: uuid(),
        //                 type: DataItemType.String,
        //             },
        //         },
        //     })
        data.structure[key] = {
                        id: uuid(),
                        type: DataItemType.String,
                    }

        // data.update(prevData => {
        //     if (prevData.type !== DataItemType.Object) {
        //         return prevData;
        //     }
        //
        //     let key = 1;
        //     for (let i = 1; i < 101; i++) {
        //         if (!(prevData.structure || {})[i]) {
        //             key = i;
        //             break;
        //         }
        //     }
        //
        //     if (key === 101) {
        //         // TODO: add popup that states that max number is 100
        //         return prevData;
        //     }
        //
        //     return ({
        //         ...prevData,
        //         structure: {
        //             ...(prevData.structure || {}),
        //             [key]: {
        //                 id: uuid(),
        //                 type: DataItemType.String,
        //             },
        //         },
        //     })
        // })
    };
</script>

<!--        bind:value={$data.type}-->
<Select
        label="Type"
        bind:value={data.type}
        on:blur={() => touchedFields.type = true}
        error={errors.type}
>
    {#each Object.values(DataItemType) as dataItemType}
        <option value={dataItemType}>{dataItemType}</option>
    {/each}
</Select>

{#if data.type === DataItemType.Array}
    {#each [(() => {
        if (!data.itemType) {
            data.itemType = {
                id: uuid(),
                type: DataItemType.String,
            }
        }

        return data.itemType;
    })()] as dataItemType}
        <svelte:self bind:data={dataItemType}/>
    {/each}
{/if}
{#if data.type === DataItemType.Object}
    {#each Object.entries((() => {
        if (!data.structure) {
            data.structure = {};
        }
        return data.structure
    })()) as [key, dataItemType]}
        <div class="form-field-object-field">
            <Input label="Field" bind:value={key}/>
            <svelte:self bind:data={dataItemType}/>
        </div>
    {/each}
    <button type="button" on:click={addField}>Add field</button>
{/if}
