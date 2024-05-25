import Message from "@/types/Message";
import MessageType from "@/types/MessageType";

const scripts_url =
  "https://raw.githubusercontent.com/dvishal485/guide_me/main/configs";

chrome.runtime.onMessage.addListener(
  (message: Message, _sender, sendResponse) => {
    console.log(message);
    switch (message.message_type) {
      case MessageType.FetchScripts:
        fetch(`${scripts_url}/${message.payload!}/index.json`)
          .then((response) => {
            if (response.status !== 200) {
              throw "Response status not 200!";
            } else {
              response.json().then(sendResponse);
            }
          })
          .catch((e) => {
            console.log("Error fetching scripts", e);
            sendResponse([]);
          });
        break;
      case MessageType.GetScript:
        {
          const dummyShepherdConfig = document.createElement("div");
          dummyShepherdConfig.id = "dummy_shepherd_config";
          dummyShepherdConfig.style.display = "none";
          document.body.appendChild(dummyShepherdConfig);
          fetch(`${scripts_url}/${message.payload!}`)
            .then((response) => {
              response.json().then((r) => {
                dummyShepherdConfig.textContent = JSON.stringify(r);
                // this is not used by the caller
                // sendResponse(r);
                sendResponse("");
              });
            })
            .catch(alert);
        }
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
