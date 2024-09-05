import {type Edge} from '@xyflow/svelte';
import { Flow } from '../../../../../../../shared/modules/flow/types/flow.types.ts';

export const flowToEdges = (flow: Flow): Array<Edge> => {
    return flow.connections.map(connection => ({
        id: connection.id,
        label: connection.name,
        source: connection.item1Id,
        target: connection.item2Id,
        sourceHandle: connection.item1HandleId,
        targetHandle: connection.item2HandleId,
        deletable: true,
        animated: true
    }));
};
