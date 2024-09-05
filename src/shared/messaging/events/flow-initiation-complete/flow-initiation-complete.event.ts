import {
  BaseEvent,
  MessagingEventDataMap,
  MessagingEventType,
} from "../../messaging.types";

export class FlowInitiationComplete extends BaseEvent<MessagingEventType.FlowInitiationComplete> {
  constructor(
    public readonly data: MessagingEventDataMap[MessagingEventType.FlowInitiationComplete],
  ) {
    super(MessagingEventType.FlowInitiationComplete, data);
  }
}
