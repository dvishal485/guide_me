import Message from "@/types/Message";
import MessageType from "@/types/MessageType";

const scripts_url =
  "https://raw.githubusercontent.com/dvishal485/guide_me/main/configs/";

chrome.runtime.onMessage.addListener(
  (message: Message, _sender, sendResponse) => {
    switch (message.message_type) {
      case MessageType.FetchScripts:
        fetch(scripts_url + message.payload! + "/index.json")
          .then((response) => {
            response.json().then(sendResponse);
          })
          .catch(console.error);
        break;
      case MessageType.GetScript:
        fetch(message.payload!)
          .then((response) => {
            response.json().then(sendResponse);
          })
          .catch(alert);
        break;
      case MessageType.InjectScript:
        console.log("Script injected message, no-op from tab");
        sendResponse("no-op");
        break;
      default:
        console.error("Unknown message type", message.message_type);
    }
    return true; // for async execution
  },
);
