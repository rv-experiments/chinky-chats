import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [partner, setPartner] = useState({
    name: 'Alex',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    avatar: 'https://i.pravatar.cc/150?img=3'
  });
  
  const [messages, setMessages] = useState([
    { id: 1, text: 'Good morning, love!', sender: 'partner', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
    { id: 2, text: 'Morning! How did you sleep?', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 59).toISOString() },
    { id: 3, text: 'I dreamt about you', sender: 'partner', timestamp: new Date(Date.now() - 1000 * 60 * 58).toISOString() },
    { id: 4, text: "Aww, that's sweet! What was the dream about?", sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 57).toISOString() },
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([
    'I miss you so much!',
    'What are you doing later?',
    'I was just thinking about you',
    'You make me so happy',
    "Can't wait to see you again"
  ]);

  // Simulate partner coming online
  useEffect(() => {
    const timer = setTimeout(() => {
      setPartner(prev => ({ ...prev, isOnline: true }));
      
      // Show typing indicator after 2 seconds
      setTimeout(() => {
        setIsTyping(true);
        
        // Send a message after 3 more seconds
        setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [...prev, {
            id: prev.length + 1,
            text: "Hey, I just got online! How's your day going?",
            sender: 'partner',
            timestamp: new Date().toISOString()
          }]);
        }, 3000);
      }, 2000);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    // Add user message
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    }]);
    
    setNewMessage('');
    
    // Simulate partner typing and response
    setTimeout(() => {
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          text: "That sounds wonderful! I'm so glad we're connected through SoulLink",
          sender: 'partner',
          timestamp: new Date().toISOString()
        }]);
      }, 3000);
    }, 1000);
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>SoulLink</h1>
        <p className="tagline">Stay Connected, Always</p>
      </header>
      
      <div className="chat-container">
        <div className="partner-info">
          <img src={partner.avatar} alt={partner.name} className="avatar" />
          <div className="partner-details">
            <h2>{partner.name}</h2>
            <div className="status">
              {partner.isOnline ? (
                <span className="online">● Online now</span>
              ) : (
                <span className="offline">Last seen {formatTime(partner.lastSeen)}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="messages">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`message ${message.sender === 'user' ? 'user-message' : 'partner-message'}`}
            >
              <div className="message-content">{message.text}</div>
              <div className="message-time">{formatTime(message.timestamp)}</div>
            </div>
          ))}
          
          {isTyping && (
            <div className="typing-indicator">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          )}
        </div>
        
        <div className="suggestions">
          <h3>Love Sparks</h3>
          <div className="suggestion-list">
            {suggestions.map((suggestion, index) => (
              <button 
                key={index} 
                className="suggestion-btn"
                onClick={() => setNewMessage(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
        
        <div className="message-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
