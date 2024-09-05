import {
  BaseEvent,
  isBaseEvent,
  MessagingOwnerEventMap,
  MessagingSlice,
} from "./messaging.types";

export class MessagingService<
  Self extends MessagingSlice,
  Target extends MessagingSlice,
  SO extends boolean,
  SES extends MessageEventSource,
  TES extends SO extends true ? undefined : MessageEventSource,
  TO extends SO extends true ? undefined : string,
> {
  private handlerMap = new Map<(data: never) => void, (event: Event) => void>();

  constructor(
    private readonly selfSlice: Self,
    private readonly targetSlice: Target,
    private readonly sameOrigin: SO,
    private readonly selfEventSource: SES,
    private readonly targetEventSource: TES,
    private readonly targetOrigin: TO,
  ) {
    if (<MessagingSlice>this.selfSlice === <MessagingSlice>this.targetSlice) {
      throw new Error("Target and self should differ for messaging service");
    }
  }

  send(
    event:
      | BaseEvent<MessagingOwnerEventMap[Self]>
      | BaseEvent<MessagingOwnerEventMap[MessagingSlice.Global]>,
  ) {
    if (this.sameOrigin) {
      this.selfEventSource.dispatchEvent(event.asEvent);
    } else {
      if (!this.targetOrigin || !this.targetEventSource) {
        throw new Error("Target has to be provided for cross origin messaging");
      }

      this.targetEventSource.postMessage(event.asMessage, {
        targetOrigin: this.targetOrigin,
      });
    }
  }

  sub<
    T extends
      | MessagingOwnerEventMap[Target]
      | MessagingOwnerEventMap[MessagingSlice.Global] =
      | MessagingOwnerEventMap[Target]
      | MessagingOwnerEventMap[MessagingSlice.Global],
    P extends (message: BaseEvent<T>, source?: MessageEventSource) => void = (
      message: BaseEvent<T>,
    ) => void,
  >(type: T, handler: P) {
    const messageHandler = (event: Event) => {
      if (event instanceof MessageEvent) {
        if (event.data.eventType === type) {
          handler(event.data, event.source || undefined);
        }
      } else if (event instanceof Event) {
        if (isBaseEvent(event, type)) {
          handler(event, this.selfEventSource);
        }
      }
    };

    this.handlerMap.set(handler, messageHandler);

    if (this.sameOrigin) {
      this.selfEventSource.addEventListener(type, messageHandler, false);
    } else {
      this.selfEventSource.addEventListener("message", messageHandler, false);
    }
  }

  unsub<
    T extends
      | MessagingOwnerEventMap[Target]
      | MessagingOwnerEventMap[MessagingSlice.Global] =
      | MessagingOwnerEventMap[Target]
      | MessagingOwnerEventMap[MessagingSlice.Global],
    P extends (message: BaseEvent<T>) => void = (message: BaseEvent<T>) => void,
  >(type: T, handler: P) {
    const messageHandler = this.handlerMap.get(handler);

    if (!messageHandler) {
      return;
    }

    this.handlerMap.delete(handler);

    if (this.sameOrigin) {
      this.selfEventSource.removeEventListener(type, messageHandler, false);
    } else {
      this.selfEventSource.removeEventListener("message", messageHandler);
    }
  }
}
