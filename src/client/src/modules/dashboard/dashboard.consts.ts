import { DataItemType } from "../../../../shared/modules/flow/types/data.types";
import { Flow } from "../../../../shared/modules/flow/types/flow.types";
import {
  ComparisonFlowNodeOperator,
  FlowNodeType,
} from "../../../../shared/modules/flow/types/node.types";

export const initialFlow: Flow = {
  // TODO: diff between sync and async with line type
  connections: [
    {
      id: "11",
      name: "",
      // TODO: change to input/output ids
      item1Id: "1",
      item2Id: "3",
      item1HandleId: "o1",
      item2HandleId: "i2",
    },
    {
      id: "22",
      name: "",
      // TODO: change to input/output ids
      item1Id: "1",
      item2Id: "3",
      item1HandleId: "o1",
      item2HandleId: "i3",
    },
    {
      id: "33",
      name: "",
      // TODO: change to input/output ids
      item1Id: "3",
      item2Id: "2",
      item1HandleId: "o3",
      item2HandleId: "i1",
    },
    {
      id: "44",
      name: "",
      // TODO: change to input/output ids
      item1Id: "4",
      item2Id: "2",
      item1HandleId: "o4",
      item2HandleId: "i5",
    },
    {
      id: "55",
      name: "",
      // TODO: change to input/output ids
      item1Id: "1",
      item2Id: "4",
      item1HandleId: "o1",
      item2HandleId: "i4",
    },
    {
      id: "66",
      name: "",
      // TODO: change to input/output ids
      item1Id: "6",
      item2Id: "4",
      item1HandleId: "o2",
      item2HandleId: "i6",
    },
    {
      id: "77",
      name: "",
      // TODO: change to input/output ids
      item1Id: "5",
      item2Id: "2",
      item1HandleId: "o5",
      item2HandleId: "i9",
    },
    {
      id: "88",
      name: "",
      // TODO: change to input/output ids
      item1Id: "1",
      item2Id: "5",
      item1HandleId: "o1",
      item2HandleId: "i7",
    },
    {
      id: "99",
      name: "",
      // TODO: change to input/output ids
      item1Id: "4",
      item2Id: "5",
      item1HandleId: "o4",
      item2HandleId: "i8",
    },
  ],
  nodes: [
    {
      id: "1",
      name: "Start",
      position: { x: -200, y: -200 },
      details: {
        type: FlowNodeType.Start,
        body: null,
        inputs: [],
        outputs: [
          {
            id: "o1",
            type: DataItemType.String,
          },
        ],
      },
    },
    {
      id: "2",
      name: "End",
      position: { x: 500, y: -200 },
      details: {
        type: FlowNodeType.End,
        body: null,
        outputs: [],
        inputs: [
          {
            id: "i1",
            type: DataItemType.Infer,
          },
          {
            id: "i5",
            type: DataItemType.Infer,
          },
          {
            id: "i9",
            type: DataItemType.Infer,
          },
        ],
      },
    },
    {
      id: "3",
      name: "Comp",
      position: { x: 200, y: -250 },
      details: {
        type: FlowNodeType.Comparison,
        body: { operator: ComparisonFlowNodeOperator.LessThan },
        outputs: [
          {
            id: "o3",
            type: DataItemType.Boolean,
          },
        ],
        inputs: [
          {
            id: "i2",
            type: DataItemType.String,
          },
          {
            id: "i3",
            type: DataItemType.String,
          },
        ],
      },
      // }, {
      //     id: '4',
      //     name: 'LLM',
      //     position: {x: 250, y: 150},
      //     details: {
      //         type: FlowNodeType.LLM,
      //         body: { prompt: 'Give me a Translation of the following word to russian.\nWord: {{0}}.\n Give me just the translation, no explanation, no additional context.' },
      //         outputs: [{
      //             id: 'o4',
      //             type: DataItemType.String,
      //         }],
      //         inputs: [{
      //             id: 'i4',
      //             type: DataItemType.String,
      //         }],
      //     },
      // }],
    },
    {
      id: "4",
      name: "LLM",
      position: { x: -200, y: 0 },
      details: {
        type: FlowNodeType.LLM,
        body: {
          prompt: `
Generate me a character. They are {{0}}. young={{1}}.
Provide a response in such a format:
{
    firstName: 'string',
    lastName: 'string',
    age: number,
    description: 'string'
}

Return just a valid JSON. No explanation, no context.
                `,
        },
        outputs: [
          {
            id: "o4",
            type: DataItemType.Object,
            structure: {
              firstName: { id: "d1", type: DataItemType.String },
              lastName: { id: "d2", type: DataItemType.String },
              age: { id: "d3", type: DataItemType.Number },
              description: { id: "d4", type: DataItemType.String },
            },
          },
        ],
        inputs: [
          {
            id: "i4",
            type: DataItemType.String,
          },
          {
            id: "i6",
            type: DataItemType.Boolean,
          },
        ],
      },
    },
    {
      id: "5",
      name: "LLM",
      position: { x: 250, y: 150 },
      details: {
        type: FlowNodeType.LLM,
        body: {
          prompt: `
I need you to write me a short story about some character. Start a story with mentioning their age.
Please keep it short, no more that a 5 sentences.
They are {{0}}.
Info: {{1}}

Return just story text. No explanation, no context.
                `,
        },
        outputs: [
          {
            id: "o5",
            type: DataItemType.String,
          },
        ],
        // TODO: maybe infer?
        inputs: [
          {
            id: "i7",
            type: DataItemType.String,
          },
          {
            id: "i8",
            type: DataItemType.Object,
            structure: {
              firstName: { id: "d1", type: DataItemType.String },
              lastName: { id: "d2", type: DataItemType.String },
              age: { id: "d3", type: DataItemType.Number },
              description: { id: "d4", type: DataItemType.String },
            },
          },
        ],
      },
    },
    {
      id: "6",
      name: "Const is old",
      position: { x: -250, y: -450 },
      details: {
        type: FlowNodeType.Const,
        body: {
          type: DataItemType.Boolean,
          value: true,
        },
        outputs: [
          {
            id: "o2",
            type: DataItemType.Boolean,
          },
        ],
        inputs: [],
      },
    },
  ],
  id: "000",
  externalVariablesSet: new Set(),
};
