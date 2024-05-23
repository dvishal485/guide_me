import Message from "../types/Message";

chrome.runtime.onMessage.addListener(
  (message: Message, sender, sendResponse) => {
    console.log("message received by browser", message);
    console.log("sender", sender);
    sendResponse("hello from browser");
    return true; // for async execution
  },
);
