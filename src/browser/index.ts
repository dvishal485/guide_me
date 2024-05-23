import Message from "../types/Message";
import MessageType from "../types/MessageType";

chrome.runtime.onMessage.addListener(
  (message: Message, sender, sendResponse) => {
    switch (message.message_type) {
      case MessageType.PopupOpen:
        sendResponse("hello from browser");
        break;
      case MessageType.InjectScript:
        console.log("Injecting script");
        chrome.tabs.executeScript(sender.tab!.id!, {
          runAt: "document_end",
          file: "shepherd_injection.js",
        });
        break;
      default:
        console.error("Unknown message type", message.message_type);
    }
    return true; // for async execution
  },
);
