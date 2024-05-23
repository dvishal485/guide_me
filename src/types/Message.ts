import MessageType from "./MessageType";

interface Message {
  message_type: MessageType;
  payload?: string;
}

export default Message;
