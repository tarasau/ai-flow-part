import { MessagingService } from "../../../../shared/messaging/messaging.service.ts";
import { MessagingSlice } from "../../../../shared/messaging/messaging.types.ts";

export type AppMessagingService = MessagingService<
  MessagingSlice.App,
  MessagingSlice.Flow,
  boolean,
  Window & typeof globalThis,
  MessageEventSource | undefined,
  undefined
>;
