// import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
// import Message from "./types/Message";
// import MessageType from "./types/MessageType";

function inject() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log("tabs", tabs);
    const tab = tabs[0];
    if (!tab.id) {
      console.log("tab id not found");
      return;
    }
    // chrome.scripting.executeScript({
    //   target: { tabId: tab.id },
    //   files: ["assets/shepherd_injection.js"],
    // });
    // const message: Message = {
    //   message_type: MessageType.InjectScript,
    //   payload: tab.id,
    // };
    // chrome.tabs.sendMessage(tab.id, message, (response) => {
    //   console.log("message received by tab:", response);
    // });
    // chrome.scripting.insertCSS({
    //   target: {
    //     tabId: tab.id,
    //   },
    //   files: ["assets/style.css"],
    // });
    chrome.scripting.executeScript({
      target: {
        tabId: tab.id,
      },
      files: ["assets/shepherd_css.js"],
    });

    chrome.scripting.executeScript({
      target: {
        tabId: tab.id,
      },
      files: ["assets/shepherd_injection.js"],
    });
  });

  // chrome.tabs &&
  //   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //     console.log("tabs", tabs);
  //     const tab = tabs[0];
  //     if (!tab.id) {
  //       console.log("tab id not found");
  //       return;
  //     }

  //     const message: Message = {
  //       message_type: MessageType.InjectScript,
  //       payload: "injection",
  //     };

  //     chrome.tabs.sendMessage(tab.id, message, (response) => {
  //       console.log("message received by tab:", response);
  //     });
  //   });
}

function App() {
  // React.useEffect(() => {
  //   chrome.tabs &&
  //     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //       console.log("tabs", tabs);
  //       const tab = tabs[0];
  //       if (!tab.id) {
  //         console.log("tab id not found");
  //         return;
  //       }

  // const message: Message = {
  //   message_type: MessageType.PopupOpen,
  //   payload: "hello from popup",
  // };

  // chrome.tabs.sendMessage(tab.id, message, (response) => {
  //   console.log("message received by tab:", response);
  //   setMessage(response);
  // });
  //     });
  // }, []);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>GuideMe!</h1>
      <div className="card">
        <div>Let me guide you!</div>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <button onClick={inject}>Inject code!</button>
    </>
  );
}

export default App;
