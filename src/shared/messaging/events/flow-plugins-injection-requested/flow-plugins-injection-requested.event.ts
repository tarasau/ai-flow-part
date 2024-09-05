import {
  BaseEvent,
  MessagingEventDataMap,
  MessagingEventType,
} from "../../messaging.types";

export class FlowPluginsInjectionRequested extends BaseEvent<MessagingEventType.FlowPluginsInjectionRequested> {
  constructor(
    public readonly data: MessagingEventDataMap[MessagingEventType.FlowPluginsInjectionRequested],
  ) {
    super(MessagingEventType.FlowPluginsInjectionRequested, data);
  }
}
