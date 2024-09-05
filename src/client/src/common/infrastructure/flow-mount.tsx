import {
  Accessor,
  Match,
  Switch,
  createSignal,
  lazy,
  onCleanup,
  createEffect,
  Signal,
} from "solid-js";
import { styled } from "solid-styled-components";
import type { Flow } from "../../../../shared/modules/flow/types/flow.types.ts";
import { FlowInitiationRequested } from "../../../../shared/messaging/events/flow-initiation-requested/flow-initiation-requested.event.ts";
import { MessagingService } from "../../../../shared/messaging/messaging.service.ts";
import { FlowInitiationComplete } from "../../../../shared/messaging/events/flow-initiation-complete/flow-initiation-complete.event.ts";
import {
  MessagingEventType,
  MessagingSlice,
} from "../../../../shared/messaging/messaging.types.ts";
import { FlowMountingDone } from "../../../../shared/messaging/events/flow-mounting-done/flow-mounting-done.event.ts";
import { AppMessagingService } from "../../modules/dashboard/dashboard.types.tsx";
import { FlowPluginsInjectionRequested } from "@shared/messaging/events/flow-plugins-injection-requested/flow-plugins-injection-requested.event.ts";
import { FlowPlugin } from "@shared/modules/flow/types/plugin.types.ts";

const Wrapper = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Flow = styled("div")`
  height: 600px;
  width: 800px;
  border: 5px solid #91919a;
`;
const Frame = styled("iframe")`
  height: 600px;
  width: 800px;
  border: 5px solid #91919a;
`;

const isSameOrigin = import.meta.env.PROD;

// @ts-ignore
const flowMount = isSameOrigin && lazy(() => import("flow/mount"));

type FlowMountProps = {
  flow: Accessor<Flow>;
  plugins: Accessor<Array<FlowPlugin>>;
  messagingServiceSignal: Signal<AppMessagingService | null>;
};

export function FlowMount({
  flow,
  plugins,
  messagingServiceSignal,
}: FlowMountProps) {
  const [isFlowInitializing, setIsFlowInitializing] = createSignal(true);

  const [flowFrame, setFlowFrame] = createSignal<HTMLIFrameElement | null>(
    null,
  );
  const [flowMessageEventSource, setFlowMessageEventSource] =
    createSignal<MessageEventSource | null>(null);

  createEffect(() => {
    const initMS = new MessagingService(
      MessagingSlice.App,
      MessagingSlice.Flow,
      isSameOrigin,
      window,
      undefined,
      isSameOrigin ? undefined : import.meta.env.VITE_FLOW_URL,
    );

    const flowMountingDoneHandler = (
      _: FlowMountingDone,
      source?: MessageEventSource,
    ) => {
      if (!source) {
        throw new Error("Event source is missing for mounting done event");
      }

      setFlowMessageEventSource(source);
    };

    initMS.sub(MessagingEventType.FlowMountingDone, flowMountingDoneHandler);

    onCleanup(() => {
      initMS.unsub(
        MessagingEventType.FlowMountingDone,
        flowMountingDoneHandler,
      );
    });
  });

  const [messagingService, setMessagingService] = messagingServiceSignal;

  createEffect(() => {
    const frame = flowFrame();
    const eventSource = flowMessageEventSource();

    if (!isSameOrigin && (!frame || !eventSource)) {
      return null;
    }

    setMessagingService(
      new MessagingService(
        MessagingSlice.App,
        MessagingSlice.Flow,
        isSameOrigin,
        window,
        isSameOrigin ? undefined : eventSource || undefined,
        isSameOrigin ? undefined : import.meta.env.VITE_FLOW_URL,
      ),
    );
  });

  createEffect(() => {
    const ms = messagingService();

    if (!ms) {
      return;
    }

    const flowInitiationCompleteHandler = (e: FlowInitiationComplete) => {
      if (e.data.id === flow().id) {
        setIsFlowInitializing(false);
      }
    };

    ms.sub(
      MessagingEventType.FlowInitiationComplete,
      flowInitiationCompleteHandler,
    );

    ms.send(
      new FlowInitiationRequested({
        value: JSON.parse(JSON.stringify(flow())),
      }),
    );

    onCleanup(() => {
      ms.unsub(
        MessagingEventType.FlowInitiationComplete,
        flowInitiationCompleteHandler,
      );
    });
  });

  createEffect(() => {
    const ms = messagingService();

    if (!ms) {
      return;
    }

    ms.send(
      new FlowPluginsInjectionRequested({
        value: JSON.parse(JSON.stringify(plugins())),
      }),
    );
  });

  return (
    <Wrapper>
      {isFlowInitializing() ? "Loading..." : null}
      <Switch>
        <Match when={!isSameOrigin}>
          <Frame src={import.meta.env.VITE_FLOW_URL} ref={setFlowFrame} />
        </Match>
        <Match when={isSameOrigin}>
          {flowMount && <Flow ref={flowMount} />}
        </Match>
      </Switch>
    </Wrapper>
  );
}
