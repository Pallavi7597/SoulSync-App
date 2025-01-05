import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { issueId } = useParams(); 

  useEffect(() => {
    // You can use the issueId to customize the chatbot's behavior or send it to the backend
    console.log("Selected issue:", issueId);
  }, [issueId]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: input,
          issue: issueId  // Pass the issue as part of the request body
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.status === "success") {
        const botMessage = { sender: "bot", text: data.response };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        speak(data.response); // Trigger TTS
      } else {
        const errorMessage = data.error || "Sorry, something went wrong.";
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: errorMessage },
        ]);
        speak(errorMessage); // Trigger TTS
      }
    } catch (error) {
      console.error("Error:", error.message);
      const fallbackMessage = "Sorry, something went wrong. Please try again later.";
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: fallbackMessage },
      ]);
      speak(fallbackMessage); // Trigger TTS
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !isLoading) {
      handleSendMessage();
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="carelia">
      <div className="header">
        <img src="/Carelia.png" alt="Carelia Logo" className="logo" />
        <h1>Carelia</h1>
      </div>
      <p className="subheading">Your mental health assistant</p>
      <div className="messages">
  {messages.map((msg, idx) => (
    <div key={idx} className={`message ${msg.sender}`}>
      {msg.text}
    </div>
  ))}
</div>


      <div className="input-box">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          aria-label="Chat input"
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
        >
          {isLoading ? "Loading..." : "Send"}
        </button>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          overflow: hidden;
          font-family: 'Arial', sans-serif;
          background: linear-gradient(135deg, #A1C4FD, #C2E9FB);
        }

        .carelia {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          height: 100vh;
          width: 100vw;
          text-align: center;
          padding: 20px;
        }

        .header {
          margin-top: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo {
          max-width: 50px;
          margin-right: 10px;
        }

        .header h1 {
          font-size: 2.5rem;
          color: #6b4f97;
        }

        .subheading {
          font-size: 1.5rem;
          color: #6b4f97;
          font-weight: normal;
          margin-top: 10px;
        }

        .messages {
  flex-grow: 1;
  width: 100%;
  max-width: 1600px;
  height: 100%;
  max-height: 600px;
  padding: 20px;
  overflow-y: auto;
  background-color: #e9f5fc;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin: 20px 0px;
  margin-bottom: 85px;
  height: calc(80vh - 150px);  /* Make message box take full height minus the header and input box */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

        .placeholder {
          color: #aaa;
          text-align: center;
          font-style: italic;
          font-size: 1.2rem;
        }

        .message {
          margin: 10px 0;
          padding: 12px 16px;
          border-radius: 10px;
          max-width: 80%;
          word-wrap: break-word;
        }

        .message.user {
          align-self: flex-end;
          background-color: #6b4f97;
          color: white;
        }

        .message.bot {
          align-self: flex-start;
          background-color: #f0f7fa;
          color: #333;
          border: 1px solid #ddd;
        }

        .input-box {
          display: flex;
          width: 100%;
          max-width: 1500px;
          padding: 12px 18px;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          position: absolute;
          bottom: 20px;
        }

        .input-box input {
          flex: 1;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin-right: 10px;
          font-size: 1rem;
        }

        .input-box button {
          padding: 12px 20px;
          background-color: #6b4f97;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .input-box button:hover {
          background-color: #5a3e85;
        }

        .input-box button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
