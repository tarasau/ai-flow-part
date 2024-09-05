import { FlowEventType, FlowEventTypeDataMap } from "./event.types.ts";

export class FlowEvent<T extends FlowEventType> extends Event {
  constructor(
    public readonly eventType: T,
    public readonly data: FlowEventTypeDataMap[T],
    eventInitDict?: EventInit,
  ) {
    super(eventType, eventInitDict);
  }

  static is<T extends FlowEventType>(
    e: Event,
    type: FlowEventType,
  ): e is FlowEvent<T> {
    return e instanceof FlowEvent && e.eventType === type;
  }

  static isAny(e: unknown): e is FlowEvent<FlowEventType> {
    return (
      e instanceof FlowEvent &&
      Object.values(FlowEventType).includes(e.eventType)
    );
  }
}
