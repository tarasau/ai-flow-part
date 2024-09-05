import { Accessor, createEffect, createMemo, createSignal, getOwner, onCleanup } from 'solid-js';
import { FieldApi } from '@tanstack/solid-form';
import { FlowMount } from '@infrastructure/flow-mount.tsx';
import type { Flow } from '@shared/modules/flow/types/flow.types.ts';
import { FlowNode, ReservedFlowNodeType } from '@shared/modules/flow/types/node.types.ts';
import { DataItemType } from '@shared/modules/flow/types/data.types.ts';
import { FlowExecutor } from '@shared/modules/flow/execution/executor/executor.ts';
import { AppMessagingService } from './dashboard.types.tsx';
import { FlowExecutionStateUpdated } from '@shared/messaging/events/flow-execution-state-updated/flow-execution-state-updated.event.ts';
import { nodesAndEdgesToFlow } from '../../../../microfrontends/flow/src/modules/shared/mappers/flow/nodes-and-edges-to-flow.ts';
import { flowToNodes } from '../../../../microfrontends/flow/src/modules/shared/mappers/flow/flow-to-nodes.ts';
import { flowToEdges } from '../../../../microfrontends/flow/src/modules/shared/mappers/flow/flow-to-edges.ts';
import {
  ComparisonFlowNodeOperator,
  performComparison,
} from '@shared/modules/flow/execution/node-executors/comparison.ts';
import { performLLM } from '@shared/modules/flow/execution/node-executors/llm.ts';
import { performConst } from '@shared/modules/flow/execution/node-executors/const.ts';
import { performException } from '@shared/modules/flow/execution/node-executors/exception.ts';
import { useCodeExecutor } from '@infrastructure/code-executor.tsx';
import { getPlugins } from '../flows/flows.service.ts';

const initialFlow: Flow = {
  connections: [
    {
      id: '11',
      name: '',
      item1Id: '1',
      item2Id: '3',
      item1HandleId: 'o1',
      item2HandleId: 'i2',
    },
    {
      id: '22',
      name: '',
      item1Id: '1',
      item2Id: '3',
      item1HandleId: 'o1',
      item2HandleId: 'i3',
    },
    {
      id: '33',
      name: '',
      item1Id: '3',
      item2Id: '2',
      item1HandleId: 'o3',
      item2HandleId: 'i1',
    },
    {
      id: '44',
      name: '',
      item1Id: '4',
      item2Id: '2',
      item1HandleId: 'o4',
      item2HandleId: 'i5',
    },
    {
      id: '55',
      name: '',
      item1Id: '1',
      item2Id: '4',
      item1HandleId: 'o1',
      item2HandleId: 'i4',
    },
    {
      id: '66',
      name: '',
      item1Id: '6',
      item2Id: '4',
      item1HandleId: 'o2',
      item2HandleId: 'i6',
    },
    {
      id: '77',
      name: '',
      item1Id: '5',
      item2Id: '2',
      item1HandleId: 'o5',
      item2HandleId: 'i9',
    },
    {
      id: '88',
      name: '',
      item1Id: '1',
      item2Id: '5',
      item1HandleId: 'o1',
      item2HandleId: 'i7',
    },
    {
      id: '99',
      name: '',
      item1Id: '4',
      item2Id: '5',
      item1HandleId: 'o4',
      item2HandleId: 'i8',
    },
    {
      id: '100',
      name: '',
      item1Id: '666',
      item2Id: '2',
      item1HandleId: 'o2222',
      item2HandleId: 'i99',
    },
  ],
  nodes: [
    {
      id: '1',
      name: 'Start',
      type: ReservedFlowNodeType.Start,
      position: { x: -200, y: -200 },
      details: {
        type: ReservedFlowNodeType.Start,
        body: null,
        inputs: [],
        outputs: [
          {
            id: 'o1',
            type: DataItemType.String,
          },
        ],
      },
    },
    {
      id: '2',
      name: 'End',
      type: ReservedFlowNodeType.End,
      position: { x: 500, y: -200 },
      details: {
        type: ReservedFlowNodeType.End,
        body: null,
        outputs: [],
        inputs: [
          {
            id: 'i1',
            type: DataItemType.Infer,
          },
          {
            id: 'i5',
            type: DataItemType.Infer,
          },
          {
            id: 'i9',
            type: DataItemType.Infer,
          },
          {
            id: 'i99',
            type: DataItemType.Infer,
          },
        ],
      },
    },
    {
      id: '3',
      name: 'Comp',
      type: 'comparison',
      position: { x: 200, y: -250 },
      details: {
        type: 'comparison',
        body: { operator: ComparisonFlowNodeOperator.LessThan },
        outputs: [
          {
            id: 'o3',
            type: DataItemType.Boolean,
          },
        ],
        inputs: [
          {
            id: 'i2',
            type: DataItemType.String,
          },
          {
            id: 'i3',
            type: DataItemType.String,
          },
        ],
      },
    },
    {
      id: '4',
      name: 'LLM',
      type: 'llm',
      position: { x: -200, y: 0 },
      details: {
        type: 'llm',
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
            id: 'o4',
            type: DataItemType.Object,
            structure: {
              firstName: { id: 'd1', type: DataItemType.String },
              lastName: { id: 'd2', type: DataItemType.String },
              age: { id: 'd3', type: DataItemType.Number },
              description: { id: 'd4', type: DataItemType.String },
            },
          },
        ],
        inputs: [
          {
            id: 'i4',
            type: DataItemType.String,
          },
          {
            id: 'i6',
            type: DataItemType.Boolean,
          },
        ],
      },
    },
    {
      id: '5',
      name: 'LLM',
      type: 'llm',
      position: { x: 250, y: 150 },
      details: {
        type: 'llm',
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
            id: 'o5',
            type: DataItemType.String,
          },
        ],
        inputs: [
          {
            id: 'i7',
            type: DataItemType.String,
          },
          {
            id: 'i8',
            type: DataItemType.Object,
            structure: {
              firstName: { id: 'd1', type: DataItemType.String },
              lastName: { id: 'd2', type: DataItemType.String },
              age: { id: 'd3', type: DataItemType.Number },
              description: { id: 'd4', type: DataItemType.String },
            },
          },
        ],
      },
    },
    {
      id: '6',
      name: 'Const is old',
      type: 'const',
      position: { x: -250, y: -450 },
      details: {
        type: 'const',
        body: {
          type: {
            id: 'is-old-const',
            type: DataItemType.Boolean,
          },
          value: true,
        },
        outputs: [
          {
            id: 'o2',
            type: DataItemType.Infer,
          },
        ],
        inputs: [],
      },
    },
    {
      id: '666',
      name: 'Custom',
      type: 'custom',
      position: { x: 250, y: -450 },
      details: {
        type: 'custom-node',
        body: {
          value: true,
        },
        outputs: [
          {
            id: 'o2222',
            type: DataItemType.Boolean,
          },
        ],
        inputs: [],
      },
    },
  ],
  id: '000',
  externalVariablesSet: [],
};

console.log(JSON.stringify(initialFlow));

function FieldInfo({ field }: { field: Accessor<FieldApi<any, any, any, any>> }) {
  return (
    <>
      {field().state.meta.touchedErrors ? <em>{field().state.meta.touchedErrors}</em> : null}
      {field().state.meta.isValidating ? 'Validating...' : null}
    </>
  );
}

export const DashboardPage = () => {
  const [flow] = createSignal(initialFlow);
  const messagingServiceSignal = createSignal<AppMessagingService | null>(null);
  const [messagingService] = messagingServiceSignal;

  const pluginsResponse = getPlugins();

  const plugins = createMemo(() => pluginsResponse.data || []);

  const pluginExecutorMap = createMemo(() => {
    const map = new Map<string, string>();

    if (pluginsResponse.data) {
      pluginsResponse.data.forEach((item) => {
        map.set(item.id, item.executor);
      });
    }

    return map;
  });

  const flowExecutor = new FlowExecutor();

  const codeExecutor = useCodeExecutor();

  createEffect(() => {
    if (!codeExecutor) {
      return;
    }
    const owner = getOwner();

    if (!owner) {
      throw new Error('Effect owner expected');
    }

    // TODO: also run with web worker while in iframe to offload execution
    const buildExecutor = (scriptText: string) =>
      function* runInIframe(
        node: FlowNode,
        inputs: Array<unknown>,
      ): Generator<
        null | unknown | Promise<null> | Promise<unknown>,
        Array<unknown>,
        Array<unknown>
      > {
        if (!codeExecutor) {
          throw new Error('Code executor expected');
        }

        const script = `
        ${scriptText}

        let cur;

        do {
          cur = perform(JSON.parse('${JSON.stringify(node)}'), JSON.parse('${JSON.stringify(inputs)}'))
            .next();

        } while (cur.done !== true)

        ${codeExecutor.buildExecutionResultExtractor('JSON.stringify(cur.value)')};
      `;

        return yield new Promise<Array<unknown>>(async (mainResolve) => {
          const res = await codeExecutor.execute(owner, script);

          mainResolve(JSON.parse(res));
        });
      };

    flowExecutor
      .registerNodeExecutor('const', performConst)
      .registerNodeExecutor('exception', performException)
      .registerNodeExecutor('comparison', performComparison)
      .registerNodeExecutor('llm', performLLM);

    pluginExecutorMap().forEach((value, key) => {
      flowExecutor.registerNodeExecutor(key, buildExecutor(value));
    });
  });

  flowExecutor.setOnUpdate((state) => {
    messagingService()?.send(new FlowExecutionStateUpdated({ state }));
  });

  onCleanup(() => {
    flowExecutor.destroy();
  });

  const executeHandler = () => {
    const nodes = flowToNodes(flow());
    const edges = flowToEdges(flow());

    flowExecutor.execute(nodesAndEdgesToFlow(nodes, edges, flow()), ['Elf']);
  };

  return (
    <div>
      <h3>Welcome!</h3>

      <button type="button" onClick={executeHandler}>
        Execute
      </button>
      <FlowMount flow={flow} plugins={plugins} messagingServiceSignal={messagingServiceSignal} />
    </div>
  );
};
