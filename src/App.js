import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";

function App() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setchatHistory] = useState([]);
  const surpriseOptions = [
    "Who won the latest Nobel Peace Prize?",
    "Where does the pizza come from?",
    "Who do you make a BLT sandwich?",
  ];
  const surprise = () => {
    console.log(Math.floor(Math.random() * surpriseOptions.length));
    const randomValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
    console.log(randomValue);
  };

  const clear =()=>{
    setValue("")
    setError("")
    setchatHistory([])
  }

  const getResponse = async () => {
    if (!value) {
      setError("error! Please ask a question");
      return;
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory,
          message: value,
        }),
        headers: {
          "content-type": "application/json",
        },
      };
      const response = await fetch("http://localhost:8000/gemini", options);
      const data = await response.text();
      console.log(data);
      setchatHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: "user",
          parts: value,
        },
        {
          role: "model",
          parts: data,
        },
      ]);
      setValue("");
    } catch (error) {
      console.error(error);
      setError("something went wrong! Please try again later");
    }
  };

  return (
    <div className="app">
      <section>
        <p>
          What do you know?
          <button
            className="surprise"
            onClick={surprise}
            disabled={!chatHistory}
          >
            {" "}
            Surprise Me
          </button>
        </p>
        <div className="input-container">
          <input
            value={value}
            placeholder="When is Christmas ... ?"
            onChange={(e) => setValue(e.target.value)}
          />
          {!error && (
            <button className="ask_me" onClick={getResponse}>
              {" "}
              ASK Me
            </button>
          )}
          {error && <button className="clear" onClick={clear}> Clear</button>}
        </div>
        {error && <p>{error}</p>}
        <div className="search-result">
          {chatHistory.map((chatItem, _index) => (
            <div key={_index}>
              <p className="answer">
                {chatItem.role}:{chatItem.parts}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
