import { useState } from "react";
import axios from "axios";
import "./App.css";

// const apikey = "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";

// const BACKOFF_INITIAL_DELAY = 1000;
// let backoffDelay = BACKOFF_INITIAL_DELAY;

function App() {
  const [inputValue, setInputValue] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setChatLog((prevChatLog) => [
      ...prevChatLog,
      { type: "user", message: inputValue },
    ]);

    try {
      await sendMessage(inputValue);
    } catch (error) {
      setError("An error occurred while sending the message.");
    }

    setInputValue("");
  };

  const sendMessage = async (message) => {
    setIsLoading(true);
    setError(null);

    const url = "https://api.openai.com/v1/chat/completions";
    const headers = {
      "Content-type": "application/json",
      // Authorization: "Bearer " + apikey,
    };

    const data = {
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message },
      ],
      model: "gpt-3.5-turbo",
    };

    try {
      const response = await axios.post(url, data, { headers });

      // backoffDelay = BACKOFF_INITIAL_DELAY;

      setChatLog((prevChatLog) => [
        ...prevChatLog,
        { type: "bot", message: response.data.choices[0].message.content },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while communicating with the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="chat-container">
        <div className="chat-log">
          <h1>ChatGPT</h1>
          {chatLog.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${
                message.type === "user" ? "user-message" : "bot-message"
              }`}
            >
              {message.message}
            </div>
          ))}
          {error && <p className="error-message">{error}</p>}
        </div>

        <form onSubmit={handleSubmit} className="message-form">
          <input
            type="text"
            name="msg"
            id="msg"
            className="message-input"
            placeholder="Type your message here ....."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" className="send-button" disabled={isLoading}>
            {isLoading ? <div className="loading-spinner"></div> : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
