import { FlowEvent } from '../event/event.ts';
import { FlowEventType } from '../event/event.types.ts';

export class FlowEventEmitter extends EventTarget {
  private handlerMap = new Map<
    (event: FlowEvent<never>) => void,
    (event: Event) => void
  >();

  constructor() {
    super();
  }

  addEventListener() {
    throw new Error("Please use sub instead");
  }

  removeEventListener() {
    throw new Error("Please use unsub instead");
  }

  dispatchEvent(_: Event): boolean {
    throw new Error("Please use send instead");
  }

  sub<T extends FlowEventType>(
    type: T,
    callback: (event: FlowEvent<T>) => void,
    options?: AddEventListenerOptions | boolean,
  ) {
    const handler = (event: Event) => {
      if (!FlowEvent.is<T>(event, type)) {
        throw new Error("Unexpected event");
      }

      callback(event);
    };

    this.handlerMap.set(callback, handler);

    super.addEventListener(type, handler, options);
  }

  unsub<T extends FlowEventType>(
    type: T,
    callback: (event: FlowEvent<T>) => void,
    options?: EventListenerOptions | boolean,
  ) {
    const handler = this.handlerMap.get(callback);

    if (!handler) {
      throw new Error("Unexpected event");
    }

    this.handlerMap.delete(callback);

    super.removeEventListener(type, handler, options);
  }

  send(event: FlowEvent<FlowEventType>) {
    super.dispatchEvent(event);
  }
}
