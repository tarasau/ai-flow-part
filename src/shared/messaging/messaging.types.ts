import { FlowInitiationRequestedData } from "./events/flow-initiation-requested/flow-initiation-requested.types.ts";
import { FlowInitiationCompleteData } from "./events/flow-initiation-complete/flow-initiation-complete.types.ts";
import { FlowMountingDoneData } from "./events/flow-mounting-done/flow-mounting-done.types.ts";
import { FlowExecutionStateUpdatedData } from "./events/flow-execution-state-updated/flow-execution-state-updated.types.ts";
import { FlowPluginsInjectionRequestedData } from "./events/flow-plugins-injection-requested/flow-plugins-injection-requested.types.ts";

export enum MessagingSlice {
  Global = "global",
  App = "app",
  Flow = "flow",
}

export enum MessagingEventType {
  HelloWorld = "HELLO_WORLD",
  FlowMountingDone = "FLOW_MOUNTING_DONE",
  FlowInitiationRequested = "FLOW_INITIATION_REQUESTED",
  FlowInitiationComplete = "FLOW_INITIATION_COMPLETE",
  FlowExecutionStateUpdated = "FLOW_EXECUTION_STATE_UPDATED",
  FlowPluginsInjectionRequested = "FLOW_PLUGINS_INJECTION_REQUESTED",
}

export type MessagingEventDataMap = {
  [MessagingEventType.HelloWorld]: {};
  [MessagingEventType.FlowMountingDone]: FlowMountingDoneData;
  [MessagingEventType.FlowInitiationRequested]: FlowInitiationRequestedData;
  [MessagingEventType.FlowInitiationComplete]: FlowInitiationCompleteData;
  [MessagingEventType.FlowExecutionStateUpdated]: FlowExecutionStateUpdatedData;
  [MessagingEventType.FlowPluginsInjectionRequested]: FlowPluginsInjectionRequestedData;
};

export const messagingEventOwnerMap = {
  [MessagingEventType.HelloWorld]: MessagingSlice.Global,
  [MessagingEventType.FlowMountingDone]: MessagingSlice.Flow,
  [MessagingEventType.FlowInitiationRequested]: MessagingSlice.App,
  [MessagingEventType.FlowInitiationComplete]: MessagingSlice.Flow,
  [MessagingEventType.FlowExecutionStateUpdated]: MessagingSlice.App,
  [MessagingEventType.FlowPluginsInjectionRequested]: MessagingSlice.App,
} satisfies Record<MessagingEventType, MessagingSlice>;

export type MessagingOwnerEventMap = {
  [K in keyof typeof messagingEventOwnerMap as (typeof messagingEventOwnerMap)[K]]: K;
};

export abstract class BaseEvent<T extends MessagingEventType> extends Event {
  protected constructor(
    public readonly eventType: T,
    public readonly data: MessagingEventDataMap[T],
  ) {
    super(eventType);
  }

  get asMessage() {
    return {
      eventType: this.eventType,
      data: this.data,
    };
  }

  get asEvent() {
    return this;
  }
}

export const isBaseEvent = <T extends MessagingEventType>(
  event: Event,
  type: T,
): event is BaseEvent<T> => {
  return event.type === type && "data" in event;
};
