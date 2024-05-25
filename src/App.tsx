import reactLogo from "@/assets/react.svg";
import Message from "@/types/Message";
import MessageType from "@/types/MessageType";
import React from "react";
import "@/App.css";
import build from "@/tour_builder";
import viteLogo from "/vite.svg";
import DomainConfig from "./types/DomainConfig";
import match from "./utils/matcher";

function fetch_scripts(): Promise<DomainConfig[]> {
  return new Promise((resolve, reject) => {
    const scripts = [
      {
        name: "login_page.json",
        match: "/login",
        description: "Login tour for DTU Times Team Portal",
      },
    ];
    const url = new URL("https://team.dtutimes.com/login");
    const response = scripts.filter((script) => match(url, script.match));
    resolve(response);
  });

  return new Promise((resolve, reject) => {
    chrome.tabs &&
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (!tab.id) {
          console.error("tab id not found, can't fetch scripts!");
          reject("tab id not found, can't fetch scripts!");
          return;
        }

        const url = new URL(tab.url!);
        const message: Message = {
          message_type: MessageType.FetchScripts,
          payload: url.hostname,
        };

        chrome.tabs.sendMessage(tab.id, message, (scripts: DomainConfig[]) => {
          console.log("message received by tab:", scripts);

          const response = scripts.filter((script) => match(url, script.match));
          resolve(response);
        });
      });
  });
}

function App() {
  const [scripts, setScripts] = React.useState<DomainConfig[] | null>(null);

  function inject(script_idx: number) {
    if (scripts === null || scripts.length <= script_idx) {
      console.error("scripts not loaded, cannot inject!");
      return;
    }
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      const tabId = tab.id;
      if (!tabId) {
        console.error("tab id not found, cannot inject script!");
        return;
      }
      const url = new URL(tab.url!);
      chrome.scripting.executeScript({
        target: {
          tabId: tabId,
        },
        files: ["assets/shepherd_css.js"],
      });

      const message: Message = {
        message_type: MessageType.GetScript,
        payload: `${url.hostname}/${scripts[script_idx].name}`,
      };

      chrome.tabs.sendMessage(tabId, message, (script) => {
        chrome.scripting.executeScript({
          target: {
            tabId: tabId,
          },
          func: () => {
            console.log("Shepherd injection!");

            const tour = build(script.config);
            tour?.start();
          },
          // files: ["assets/shepherd_injection.js"],
        });
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

  React.useEffect(() => {
    fetch_scripts().then(setScripts);
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
      <h1>GuideMe!</h1>
      <div className="card">
        <div>Let me guide you!</div>
        <p>
          {scripts === null
            ? "Loading scripts..."
            : scripts.map((script, idx) => (
                <button onClick={() => inject(idx)}>
                  {script.description}
                </button>
              ))}
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
