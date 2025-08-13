import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaBook, FaRobot, FaUser } from 'react-icons/fa';
import { getHealthAssistantResponse } from '../services/deepSeekService';
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your Medical Assistant. You can ask me questions about symptoms, medicines, or general health concerns. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Format conversation history for the AI service
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Call DeepSeek AI service
      const response = await getHealthAssistantResponse(input, conversationHistory);
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I apologize, but I'm having trouble connecting to the AI service. Please try again later." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-page">
      {/* Navigation Bar */}
      <nav className="nav-bar">
        <div className="nav-logo">
          <Link to="/">MediVerse</Link>
          <span className="subtitle">Health Guide</span>
        </div>
        <div className="nav-links">
          <Link to="/"><FaHome /> Home</Link>
          <Link to="/symptoms"><FaSearch /> Symptoms</Link>
          <Link to="/library"><FaBook /> Medicine Library</Link>
          <Link to="/chat" className="active"><FaRobot /> Chat Assistant</Link>
          <Link to="/profile"><FaUser /> Profile</Link>
        </div>
      </nav>

      <div className="chat-container">
        <div className="chat-header">
          <h1>AI Health Assistant</h1>
          <p>Ask questions about symptoms, medicines, or health concerns</p>
        </div>
        
        <div className="chat-interface">
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                <div className="message-content">
                  {message.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message assistant">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="chat-input-container">
            <textarea
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your health-related question..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button type="submit" className="send-button" disabled={!input.trim() || isTyping}>
              <i className="fas fa-paper-plane"></i>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat; 