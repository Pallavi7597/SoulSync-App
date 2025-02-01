import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { issueId } = useParams();

  const [recognition, setRecognition] = useState(null); // Speech recognition
  const [isBotSpeaking, setIsBotSpeaking] = useState(false); // Track if bot is speaking

  useEffect(() => {
    // Initialize speech recognition
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognitionAPI =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognitionAPI();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      recognitionInstance.onresult = handleSpeechResult;
      recognitionInstance.onerror = handleSpeechError;
      setRecognition(recognitionInstance);
    } else {
      console.log("Speech Recognition not supported in this browser.");
    }

    console.log("Selected issue:", issueId);
  }, [issueId]);

  const handleSpeechResult = (event) => {
    const lastIndex = event.results.length - 1;
    const speech = event.results[lastIndex][0].transcript;
    setInput(speech);
  };

  const handleSpeechError = (event) => {
    console.error("Speech Recognition Error:", event.error);
  };

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
          issue: issueId
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.status === "success") {
        const botMessage = { sender: "bot", text: data.response };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        speak(data.response); // Speak the bot's response
      } else {
        const errorMessage = data.error || "Sorry, something went wrong.";
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: errorMessage },
        ]);
        speak(errorMessage); // Speak error message
      }
    } catch (error) {
      console.error("Error:", error.message);
      const fallbackMessage = "Sorry, something went wrong. Please try again later.";
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: fallbackMessage },
      ]);
      speak(fallbackMessage); // Speak fallback message
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
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.volume = 1; // Full volume
      utterance.rate = 1;   // Normal speaking rate
      utterance.pitch = 1;  // Normal pitch

      // Set bot speaking state to true to start animation
      setIsBotSpeaking(true);

      utterance.onend = () => {
        // Set bot speaking state to false after speaking finishes
        setIsBotSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      console.log("Speech Synthesis not supported in this browser.");
    }
  };

  const toggleSpeechRecognition = () => {
    if (recognition && !isSpeaking) {
      recognition.start();
      setIsSpeaking(true);
    } else if (recognition && isSpeaking) {
      recognition.stop();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Header with Title */}
      <div className="header">
        <img src="/Carelia.png" alt="Carelia Logo" className="logo" />
        <h1>Carelia</h1>
      </div>

      {/* Subheading */}
      <div className="subheading">
        <p>Your mental health assistant</p>
      </div>

      {/* Main Chatbot Area */}
      <div className="chat-container">
        {/* Left Side - Phone-like Chatbot */}
        <div className="left-side">
          <div className="chat-box">
            <div className="messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.sender}`}>
                  {msg.sender === 'user' ? (
                    <>
                      <div className="user-avatar">👤</div>
                      <div className="message-text">{msg.text}</div>
                    </>
                  ) : (
                    <>
                      <div className={`bot-avatar ${isBotSpeaking ? "speaking" : ""}`}>
                        {/* Avatar to show speaking animation */}
                        <img src="/avatar.jpg" alt="Doctor Avatar" className="doctor-avatar-img" />
                      </div>
                      <div className="message-text">{msg.text}</div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* User Input Section */}
          <div className="user-input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              aria-label="Chat input"
            />
            <button
              className="mic-btn"
              onClick={toggleSpeechRecognition}
              aria-label="Speak message"
            >
              {isSpeaking ? "Stop" : "🎤"}
            </button>
          </div>
        </div>

        {/* Right Side - Bot's Avatar & Responses */}
        <div className="right-side">
          <div className="bot-avatar-container">
            <img src="/avatar.jpg" alt="Doctor Avatar" className="doctor-avatar-img" />
            <div className="bot-message">
              {messages[messages.length - 1]?.sender === "bot" ? messages[messages.length - 1]?.text : "How can I assist you today?"}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .doctor-avatar-img {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 2px solid #6B4F97;
          margin-bottom: 10px;
        }

        .speaking {
          animation: lip-sync 0.5s infinite;
        }

        @keyframes lip-sync {
          0% { transform: scaleY(1); }
          50% { transform: scaleY(1.2); }
          100% { transform: scaleY(1); }
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Roboto', sans-serif;
          background: linear-gradient(135deg, #ffc0cb, #D1B5E8);  /* Very light lavender to soft light purple gradient */
          color: #333;
        }

        .chatbot-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          height: 100vh;
          padding: 20px;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .logo {
          max-width: 50px;
          margin-right: 12px;
        }

        .header h1 {
          font-size: 2.5rem;
          color: #6B4F97;
          font-weight: 700;
        }

        .subheading p {
          font-size: 1.4rem;
          color: #9F7A8E;
          margin-top: 10px;
        }

        .chat-container {
          display: flex;
          flex: 1;
          width: 100%;
          max-width: 1200px;
          justify-content: space-between;
        }

        .left-side, .right-side {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .left-side {
          width: 50%;
          background: #D1B5E8; /* Very light lavender for phone-like chatbox */
          border-radius: 16px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          padding: 20px;
          position: relative;
        }

        .chat-box {
          padding: 20px;
          flex-grow: 1;
          overflow-y: auto;
          border-radius: 16px;
          background: #ffc0cb; /* Very light lavender for chatbox background inside phone */
          box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
        }

        .messages {
          display: flex;
          flex-direction: column;
          margin-bottom: 10px;
        }

        .message {
          margin: 8px 0;
          padding: 10px 15px;
          border-radius: 12px;
          max-width: 100%;
          word-wrap: break-word;
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
        }

        .message.user {
          background-color: #D1A3C2;
          color: white;
          align-self: flex-end;
        }

        .message.bot {
          background-color: #F1D7E8;
          color: #6B4F97;
          align-self: flex-start;
        }

        .message-text {
          font-size: 1rem;
        }

        .user-avatar, .bot-avatar {
          margin-right: 12px;
        }

        .user-avatar {
          font-size: 1.5rem;
        }

        .bot-avatar {
          font-size: 3rem; /* Increased avatar size */
        }

        .user-input-container {
          display: flex;
          align-items: center;
          margin-top: 15px;
          padding: 12px;
          background: #F1D7E8;
          border-radius: 16px;
        }

        .user-input-container input {
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          font-size: 1rem;
          background: #F1D7E8;
          border: none;
        }

        .mic-btn {
          background-color: #6B4F97;
          color: white;
          border-radius: 50%;
          padding: 12px;
          font-size: 1.5rem;
          cursor: pointer;
          border: none;
        }

        .mic-btn:hover {
          background-color: #5A3E85;
        }

        .right-side {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .bot-avatar-container {
          text-align: center;
        }

        .bot-avatar-container img {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 2px solid #6B4F97;
          margin-bottom: 10px;
        }

        .bot-message {
          font-size: 1.2rem;
          color: #6B4F97;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
