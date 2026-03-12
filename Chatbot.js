import { useState, useRef, useEffect } from "react";
import "../pages/Chatbot.css";

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    {
      sender: "bot",
      text: "Hi 👋 I'm your AI Learning Assistant. Ask me about AI, quizzes, login, or this project."
    }
  ]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // ✅ Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // 🔥 CONNECT TO BACKEND
  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    // Add user message
    setChat(prev => [...prev, { sender: "user", text: userMessage }]);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();

      setChat(prev => [
        ...prev,
        { sender: "bot", text: data.reply }
      ]);

    } catch (error) {
      setChat(prev => [
        ...prev,
        { sender: "bot", text: "⚠ AI is temporarily unavailable." }
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <div className="chatbot-icon" onClick={() => setOpen(!open)}>
        🤖
      </div>

      {open && (
        <div className="chatbot-window">

          {/* Header */}
          <div className="chatbot-header">
            <span>AI Assistant</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          {/* Chat Messages */}
          <div className="chatbot-body">
            {chat.map((c, index) => (
              <div key={index} className={`chat-bubble ${c.sender}`}>
                {c.text}
              </div>
            ))}

            {loading && (
              <div className="chat-bubble bot">
                Typing...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Ask about AI, quiz, login..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>

        </div>
      )}
    </>
  );
}

export default Chatbot;