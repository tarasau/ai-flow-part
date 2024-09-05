import {
  BaseEvent,
  MessagingEventDataMap,
  MessagingEventType,
} from "../../messaging.types";

export class FlowExecutionStateUpdated extends BaseEvent<MessagingEventType.FlowExecutionStateUpdated> {
  constructor(
    public readonly data: MessagingEventDataMap[MessagingEventType.FlowExecutionStateUpdated],
  ) {
    super(MessagingEventType.FlowExecutionStateUpdated, data);
  }
}
