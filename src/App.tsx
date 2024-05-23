import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Message from "./types/Message";
import MessageType from "./types/MessageType";

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  React.useEffect(() => {
    console.log("Hello, Vite + React!");

    chrome.tabs &&
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        console.log("tabs", tabs);
        const tab = tabs[0];
        if (!tab.id) {
          console.log("tab id not found");
          return;
        }

        const message: Message = {
          message_type: MessageType.PopupOpen,
          payload: "hello from popup",
        };

        chrome.tabs.sendMessage(tab.id, message, (response) => {
          console.log("message received by tab:", response);
          setMessage(response);
        });
      });
  }, []);

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
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <div>Message is: "{message}"</div>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
