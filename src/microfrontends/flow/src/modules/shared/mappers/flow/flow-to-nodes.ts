import {type Node} from '@xyflow/svelte';
import type {NodeData} from "../../types/flow/flow.types";
import { Flow } from '../../../../../../../shared/modules/flow/types/flow.types.ts';

export const flowToNodes = (flow: Flow): Array<Node<NodeData>> => {
    return flow.nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: {
            label: node.name,
            details: node.details,
        },
    }));
};
