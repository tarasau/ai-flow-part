import {FlowNode} from "../../../../../../../shared/modules/flow/types/node.types.ts"
import {type DataItem} from "../../../../../../../shared/modules/flow/types/data.types.ts";

export type NodeData = {
    label: string,
    details: FlowNode['details'];
};

export type NodeController = {
    addInput: (nodeId: string) => void,
    addOutput: (nodeId: string, item: DataItem) => void,
    updateOutput: (nodeId: string, item: DataItem) => void,
};
