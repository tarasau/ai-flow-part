import {
  BaseEvent,
  MessagingEventDataMap,
  MessagingEventType,
} from "../../messaging.types";

export class FlowInitiationRequested extends BaseEvent<MessagingEventType.FlowInitiationRequested> {
  constructor(
    public readonly data: MessagingEventDataMap[MessagingEventType.FlowInitiationRequested],
  ) {
    super(MessagingEventType.FlowInitiationRequested, data);
  }
}
