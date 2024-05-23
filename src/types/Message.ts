import type MessageType from "./MessageType";

interface Message {
  message_type: MessageType;
  payload: unknown;
}

export default Message;
