// A tab level script was not required at all!

// import Message from "../types/Message";
// import MessageType from "../types/MessageType";

// chrome.runtime.onMessage.addListener(
//   (message: Message, _sender, sendResponse) => {
//     switch (message.message_type) {
//       case MessageType.PopupOpen:
//         sendResponse("hello from browser");
//         break;
//       case MessageType.InjectScript:
// console.log("Injecting script");
// console.log("sender", sender);
// tour.start();
// chrome.scripting.insertCSS({
//   target: {
//     tabId: message.payload as number,
//   },
//   files: ["assets/style.css"],
// });
// chrome.scripting.executeScript({
//   target: {
//     tabId: message.payload as number,
//   },
//   files: ["assets/shepherd_injection.js"],
// });

// console.log("Script injected");
//         break;
//       default:
//         console.error("Unknown message type", message.message_type);
//     }
//     return true; // for async execution
//   },
// );
