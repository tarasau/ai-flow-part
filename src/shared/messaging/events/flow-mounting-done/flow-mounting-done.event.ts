import {
  BaseEvent,
  MessagingEventDataMap,
  MessagingEventType,
} from "../../messaging.types";

export class FlowMountingDone extends BaseEvent<MessagingEventType.FlowMountingDone> {
  constructor(
    public readonly data: MessagingEventDataMap[MessagingEventType.FlowMountingDone],
  ) {
    super(MessagingEventType.FlowMountingDone, data);
  }
}
