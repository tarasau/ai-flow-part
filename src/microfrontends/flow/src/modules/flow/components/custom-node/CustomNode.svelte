<style>
    #custom-node-sandbox {
        width: 100%;
        height: 100%;
        background: #3367d9;
    }
</style>

<script lang="ts">
    import {type NodeProps} from '@xyflow/svelte';
    import NodeWrapper from "../node-wrapper/NodeWrapper.svelte";
    import type {NodeData} from "../../../shared/types/flow/flow.types";
    import NodeOutputs from "../node-outputs/NodeOutputs.svelte";
    import NodeInputs from "../node-inputs/NodeInputs.svelte";
    import { getContext, onMount } from 'svelte';
    import type { FlowPlugin } from '@shared/modules/flow/types/plugin.types.ts';
    import type { Readable } from 'svelte/store';

    export let id: string;
    export let data: NodeData;

    const pluginsMapR = getContext<Readable<Record<string, FlowPlugin>>>('pluginsMap');

    let pluginsMap: Record<string, FlowPlugin> = {};

    const render = () => {

      const iframe: HTMLIFrameElement | null = document.getElementById('custom-node-sandbox') as HTMLIFrameElement;

      if (!iframe) {
        return;
        // throw new Error('Unexpected iframe');
      }

      const doc = iframe.contentDocument || iframe.contentWindow?.document;

      if (!doc) {
        throw new Error('Unexpected iframe');
      }

      // Clear previous content
      doc.open();
      doc.close();

      const newPlugin = pluginsMap['custom-node'];

      if (!newPlugin) {
        // TODO: render placeholder notifying user that plugin not found
        return;
      }

      // Inject nodeId
      const scr = document.createElement('script');
      scr.textContent = `window.nodeId = "${id}"`;
      doc.head.appendChild(scr);

      // Inject user-provided HTML, CSS, and JS
      const style = document.createElement('style');
      style.textContent = newPlugin.css;
      doc.head.appendChild(style);

      const script = document.createElement('script');
      script.textContent = newPlugin.js;
      doc.body.innerHTML = newPlugin.html;
      doc.body.appendChild(script);
    };

    pluginsMapR.subscribe(val => {
      pluginsMap = val;
      render();
    })

    onMount(() => {
      render();
    })

    window.addEventListener('message', (event) => {
      if (event.data.type === 'getNode' && event.data.nodeId === id) {
        event.source?.postMessage({ type: 'getNodeResponse', nodeId: id, value: JSON.stringify(data) })
      }
    });
    // Note: avoid compiler warning for unregistered props
    $$restProps;
    type $$Props = NodeProps;
</script>

<NodeWrapper label={data.label} nodeId={id} noPadding={true}>
    <NodeInputs nodeId={id}/>
    <NodeOutputs nodeId={id}/>
    <iframe id="custom-node-sandbox" title="" sandbox="allow-scripts allow-same-origin"></iframe>
</NodeWrapper>
