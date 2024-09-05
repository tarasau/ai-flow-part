import { type Edge, type Node } from "@xyflow/svelte";
import type { NodeData } from "../../types/flow/flow.types";
import { FlowNode } from "../../../../../../../shared/modules/flow/types/node.types.ts";
import { Flow } from "../../../../../../../shared/modules/flow/types/flow.types.ts";

export const nodesAndEdgesToFlow = (
  nodes: Array<Node<NodeData>>,
  edges: Array<Edge>,
  prevFlow: Flow,
): Flow => {
  return {
    id: prevFlow.id,
    connections: edges.map((edge) => ({
      id: edge.id,
      name: edge.label || "",
      item1Id: edge.source,
      item2Id: edge.target,
      item1HandleId: edge.sourceHandle || "",
      item2HandleId: edge.targetHandle || "",
    })),
    nodes: nodes.map<FlowNode>((node) => ({
      id: node.id,
      name: node.data.label,
      position: node.position,
      details: node.data.details,
    })),
    externalVariablesSet: [],
  } satisfies Flow;
};
