import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaUser, FaPaperPlane } from 'react-icons/fa';
import apiService from '../services/apiService';
import './ChatAssistant.css';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your Medical Assistant. Ask me anything about symptoms, medicines, or health."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    setError(null);

    try {
      const conversationHistory = messages.map((msg) => ({ role: msg.role, content: msg.content }));
      const data = await apiService.getHealthAssistantResponse(userMessage, conversationHistory);
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error communicating with AI service:', err);
      setError('I\'m experiencing technical difficulties. Please try again or consult a healthcare professional for immediate concerns.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`floating-assistant ${isOpen ? 'open' : ''}`}>
      {!isOpen && (
        <button className="assistant-toggle" aria-label="Open assistant" onClick={() => setIsOpen(true)}>
          <span role="img" aria-label="robot">🤖</span>
        </button>
      )}

      {isOpen && (
        <div className="assistant-panel">
          <div className="assistant-header">
            <div className="title"><FaRobot /> AI Health Assistant</div>
            <button className="close-btn" aria-label="Close assistant" onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="assistant-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}>
                <div className="message-icon">{message.role === 'user' ? <FaUser /> : <FaRobot />}</div>
                <div className="message-content">{message.content}</div>
              </div>
            ))}
            {isLoading && (
              <div className="message assistant-message">
                <div className="message-icon"><FaRobot /></div>
                <div className="message-content">
                  <div className="typing-indicator"><span></span><span></span><span></span></div>
                </div>
              </div>
            )}
            {error && <div className="error-message">{error}</div>}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="assistant-input-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatAssistant; 