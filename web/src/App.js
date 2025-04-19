import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Mock data for multiple contacts
const CONTACTS = [
  {
    id: '1',
    name: 'Alex',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    avatar: 'https://i.pravatar.cc/150?img=3',
    unreadCount: 0
  },
  {
    id: '2',
    name: 'Priya',
    isOnline: true,
    lastSeen: new Date().toISOString(),
    avatar: 'https://i.pravatar.cc/150?img=5',
    unreadCount: 2
  },
  {
    id: '3',
    name: 'Rahul',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    avatar: 'https://i.pravatar.cc/150?img=8',
    unreadCount: 0
  },
  {
    id: '4',
    name: 'Sneha',
    isOnline: true,
    lastSeen: new Date().toISOString(),
    avatar: 'https://i.pravatar.cc/150?img=9',
    unreadCount: 5
  },
  {
    id: '5',
    name: 'Vikram',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    avatar: 'https://i.pravatar.cc/150?img=12',
    unreadCount: 0
  }
];

// Mock data for stickers
const STICKER_PACKS = [
  {
    id: 'pack1',
    name: 'Love Stickers',
    stickers: [
      { id: 's1', url: 'https://media.giphy.com/media/l0HlGdXFWYbKv5rby/giphy.gif' },
      { id: 's2', url: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif' },
      { id: 's3', url: 'https://media.giphy.com/media/3o7TKoWXm3okO1kgHC/giphy.gif' }
    ]
  },
  {
    id: 'pack2',
    name: 'Cute Animals',
    stickers: [
      { id: 's4', url: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif' },
      { id: 's5', url: 'https://media.giphy.com/media/3o7TKr3nzbh5WgCFxe/giphy.gif' },
      { id: 's6', url: 'https://media.giphy.com/media/3o7TKwmnDgQb5jemjK/giphy.gif' }
    ]
  }
];

// Mock data for GIFs
const TRENDING_GIFS = [
  { id: 'g1', url: 'https://media.giphy.com/media/l0HlGdXFWYbKv5rby/giphy.gif' },
  { id: 'g2', url: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif' },
  { id: 'g3', url: 'https://media.giphy.com/media/3o7TKoWXm3okO1kgHC/giphy.gif' },
  { id: 'g4', url: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif' }
];

// Mock data for regional Love Sparks
const REGIONAL_LOVE_SPARKS = {
  'en-IN': [
    'I miss you so much!',
    'What are you doing later?',
    'I was just thinking about you',
    'You make me so happy',
    "Can't wait to see you again"
  ],
  'hi-IN': [
    'मुझे तुम्हारी बहुत याद आती है!',
    'आज शाम क्या कर रहे हो?',
    'मैं अभी तुम्हारे बारे में सोच रहा था',
    'तुम मुझे बहुत खुश करते हो',
    'फिर से मिलने का इंतज़ार नहीं कर सकता'
  ],
  'ta-IN': [
    'உன்னை மிகவும் மிஸ் செய்கிறேன்!',
    'பின்னர் என்ன செய்கிறாய்?',
    'நான் இப்போது உன்னைப் பற்றி நினைத்துக் கொண்டிருந்தேன்',
    'நீ என்னை மிகவும் மகிழ்ச்சியாக்குகிறாய்',
    'உன்னை மீண்டும் பார்க்க காத்திருக்க முடியாது'
  ]
};

// Available reactions
const REACTIONS = ['❤️', '😂', '😍', '👍', '👎', '😮', '😢', '🙏'];

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState('');
  const [useEmailOtp, setUseEmailOtp] = useState(false);
  
  // Chat state
  const [contacts, setContacts] = useState(CONTACTS);
  const [activeContact, setActiveContact] = useState(null);
  const [chatMessages, setChatMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const [showGifs, setShowGifs] = useState(false);
  const [language, setLanguage] = useState('en-IN');
  const [suggestions, setSuggestions] = useState(REGIONAL_LOVE_SPARKS['en-IN']);
  
  const messagesEndRef = useRef(null);
  
  // Initialize chat messages for each contact
  useEffect(() => {
    const initialMessages = {};
    
    // Alex's messages
    initialMessages['1'] = [
      { id: 1, text: 'Good morning, love!', sender: 'partner', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), reactions: [] },
      { id: 2, text: 'Morning! How did you sleep?', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 59).toISOString(), reactions: [] },
      { id: 3, text: 'I dreamt about you', sender: 'partner', timestamp: new Date(Date.now() - 1000 * 60 * 58).toISOString(), reactions: [{ userId: 'user', reaction: '❤️' }] },
      { id: 4, text: "Aww, that's sweet! What was the dream about?", sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 57).toISOString(), reactions: [] },
    ];
    
    // Priya's messages
    initialMessages['2'] = [
      { id: 1, text: 'Hey, how are you doing today?', sender: 'partner', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), reactions: [] },
      { id: 2, text: 'I am good! Just finished my work. How about you?', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 119).toISOString(), reactions: [] },
      { id: 3, text: 'Same here. Want to catch up for dinner?', sender: 'partner', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), reactions: [{ userId: 'user', reaction: '👍' }] },
      { id: 4, text: 'There is a new restaurant in town', sender: 'partner', timestamp: new Date(Date.now() - 1000 * 60 * 9).toISOString(), reactions: [] },
    ];
    
    // Rahul's messages
    initialMessages['3'] = [
      { id: 1, text: 'Did you watch the cricket match yesterday?', sender: 'partner', timestamp: new Date(Date.now() - 1000 * 60 * 1440).toISOString(), reactions: [] },
      { id: 2, text: 'Yes! It was amazing!', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 1430).toISOString(), reactions: [{ userId: 'partner', reaction: '😍' }] },
    ];
    
    // Sneha's messages
    initialMessages['4'] = [
      { id: 1, text: 'Happy Birthday! 🎂', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), reactions: [{ userId: 'partner', reaction: '🙏' }] },
      { id: 2, text: 'Thank you so much! ❤️', sender: 'partner', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(), reactions: [] },
      { id: 3, text: 'Are you having a party?', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(), reactions: [] },
      { id: 4, text: 'Yes, tonight at 8. You must come!', sender: 'partner', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), reactions: [] },
      { id: 5, text: 'And bring Rahul too!', sender: 'partner', timestamp: new Date(Date.now() - 1000 * 60 * 29).toISOString(), reactions: [] },
    ];
    
    // Vikram's messages
    initialMessages['5'] = [
      { id: 1, text: 'Hey, can you send me those project files?', sender: 'partner', timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), reactions: [] },
      { id: 2, text: 'Sure, I will email them to you', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 179).toISOString(), reactions: [] },
      { id: 3, text: 'Thanks! Need them urgently', sender: 'partner', timestamp: new Date(Date.now() - 1000 * 60 * 178).toISOString(), reactions: [] },
    ];
    
    setChatMessages(initialMessages);
  }, []);
  
  // Simulate partner coming online for active contact
  useEffect(() => {
    if (!activeContact) return;
    
    const timer = setTimeout(() => {
      setContacts(prev => 
        prev.map(contact => 
          contact.id === activeContact.id 
            ? { ...contact, isOnline: true } 
            : contact
        )
      );
      
      if (activeContact.id === '1') {
        // Show typing indicator after 2 seconds
        setTimeout(() => {
          setIsTyping(true);
          
          // Send a message after 3 more seconds
          setTimeout(() => {
            setIsTyping(false);
            setChatMessages(prev => ({
              ...prev,
              [activeContact.id]: [
                ...prev[activeContact.id],
                {
                  id: prev[activeContact.id].length + 1,
                  text: "Hey, I just got online! How's your day going?",
                  sender: 'partner',
                  timestamp: new Date().toISOString(),
                  reactions: []
                }
              ]
            }));
          }, 3000);
        }, 2000);
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [activeContact]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeContact]);
  
  // Handle login with OTP
  const handleSendOtp = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }
    
    // Simulate OTP sending
    setTimeout(() => {
      setOtpSent(true);
      alert(`OTP sent to ${phoneNumber}${email ? ' and ' + email : ''}`);
    }, 1000);
  };
  
  const handleVerifyOtp = () => {
    if (!otp || otp.length < 4) {
      alert('Please enter a valid OTP');
      return;
    }
    
    // Simulate OTP verification
    setTimeout(() => {
      setIsAuthenticated(true);
      setUser({
        id: 'user123',
        name: 'You',
        phone: phoneNumber,
        email: email || null,
        avatar: 'https://i.pravatar.cc/150?img=7'
      });
      setShowLogin(false);
    }, 1000);
  };
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (newMessage.trim() === '' && !showStickers && !showGifs) return;
    
    if (!activeContact) return;
    
    // Add user message
    const newMsg = {
      id: chatMessages[activeContact.id].length + 1,
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
      reactions: [],
      replyTo: replyingTo
    };
    
    setChatMessages(prev => ({
      ...prev,
      [activeContact.id]: [...prev[activeContact.id], newMsg]
    }));
    
    setNewMessage('');
    setReplyingTo(null);
    
    // Simulate partner typing and response
    setTimeout(() => {
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        setChatMessages(prev => ({
          ...prev,
          [activeContact.id]: [
            ...prev[activeContact.id],
            {
              id: prev[activeContact.id].length + 1,
              text: "That sounds wonderful! I'm so glad we're connected through SoulLink",
              sender: 'partner',
              timestamp: new Date().toISOString(),
              reactions: []
            }
          ]
        }));
      }, 3000);
    }, 1000);
  };
  
  // Handle sending a sticker or GIF
  const handleSendMedia = (url, type) => {
    if (!activeContact) return;
    
    // Add media message
    const newMsg = {
      id: chatMessages[activeContact.id].length + 1,
      mediaUrl: url,
      type: type,
      sender: 'user',
      timestamp: new Date().toISOString(),
      reactions: []
    };
    
    setChatMessages(prev => ({
      ...prev,
      [activeContact.id]: [...prev[activeContact.id], newMsg]
    }));
    
    setShowStickers(false);
    setShowGifs(false);
    
    // Simulate partner typing and response
    setTimeout(() => {
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        setChatMessages(prev => ({
          ...prev,
          [activeContact.id]: [
            ...prev[activeContact.id],
            {
              id: prev[activeContact.id].length + 1,
              text: "That's so cute! 😍",
              sender: 'partner',
              timestamp: new Date().toISOString(),
              reactions: []
            }
          ]
        }));
      }, 2000);
    }, 1000);
  };
  
  // Handle adding a reaction to a message
  const handleAddReaction = (messageId, reaction) => {
    if (!activeContact) return;
    
    setChatMessages(prev => ({
      ...prev,
      [activeContact.id]: prev[activeContact.id].map(msg => 
        msg.id === messageId
          ? {
              ...msg,
              reactions: msg.reactions.some(r => r.userId === 'user')
                ? msg.reactions.map(r => r.userId === 'user' ? { ...r, reaction } : r)
                : [...msg.reactions, { userId: 'user', reaction }]
            }
          : msg
      )
    }));
  };
  
  // Format time for display
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format date for chat list
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return formatTime(isoString);
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Get the last message for a contact
  const getLastMessage = (contactId) => {
    if (!chatMessages[contactId] || chatMessages[contactId].length === 0) {
      return null;
    }
    
    return chatMessages[contactId][chatMessages[contactId].length - 1];
  };
  
  // Change language for Love Sparks
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setSuggestions(REGIONAL_LOVE_SPARKS[lang] || REGIONAL_LOVE_SPARKS['en-IN']);
  };
  
  // Render login/registration screen
  const renderLogin = () => (
    <div className="login-container">
      <div className="login-form">
        <h2>Welcome to SoulLink</h2>
        <p>Connect with your loved ones</p>
        
        <div className="form-group">
          <label>Phone Number (required)</label>
          <div className="phone-input">
            <select className="country-code">
              <option value="+91">+91</option>
              <option value="+1">+1</option>
              <option value="+44">+44</option>
            </select>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>
        
        {useEmailOtp && (
          <div className="form-group">
            <label>Email (optional)</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        )}
        
        {otpSent ? (
          <div className="form-group">
            <label>Enter OTP</label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button className="verify-btn" onClick={handleVerifyOtp}>Verify OTP</button>
          </div>
        ) : (
          <button className="login-btn" onClick={handleSendOtp}>Send OTP</button>
        )}
        
        <div className="login-options">
          <button 
            className="option-btn" 
            onClick={() => setUseEmailOtp(!useEmailOtp)}
          >
            {useEmailOtp ? 'Use Phone Only' : 'Use Email OTP'}
          </button>
        </div>
      </div>
    </div>
  );
  
  // Render chat list
  const renderChatList = () => (
    <div className="chat-list">
      <div className="user-profile">
        <img src={user?.avatar} alt={user?.name} className="avatar" />
        <div className="user-name">{user?.name}</div>
      </div>
      
      <div className="search-bar">
        <input type="text" placeholder="Search contacts..." />
      </div>
      
      <div className="contacts">
        {contacts.map(contact => {
          const lastMsg = getLastMessage(contact.id);
          return (
            <div 
              key={contact.id} 
              className={`contact-item ${activeContact?.id === contact.id ? 'active' : ''}`}
              onClick={() => setActiveContact(contact)}
            >
              <div className="contact-avatar">
                <img src={contact.avatar} alt={contact.name} className="avatar" />
                {contact.isOnline && <div className="online-indicator"></div>}
              </div>
              <div className="contact-info">
                <div className="contact-name">{contact.name}</div>
                {lastMsg && (
                  <div className="last-message">
                    {lastMsg.text ? 
                      (lastMsg.text.length > 30 ? lastMsg.text.substring(0, 30) + '...' : lastMsg.text) : 
                      (lastMsg.mediaUrl ? '📎 Media' : '')}
                  </div>
                )}
              </div>
              <div className="contact-meta">
                {lastMsg && <div className="last-time">{formatDate(lastMsg.timestamp)}</div>}
                {contact.unreadCount > 0 && (
                  <div className="unread-count">{contact.unreadCount}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
  
  // Render message with reactions
  const renderMessage = (message) => (
    <div 
      key={message.id} 
      className={`message ${message.sender === 'user' ? 'user-message' : 'partner-message'}`}
    >
      {message.replyTo && (
        <div className="reply-preview">
          <div className="reply-text">
            {chatMessages[activeContact.id].find(m => m.id === message.replyTo.id)?.text}
          </div>
        </div>
      )}
      
      {message.mediaUrl ? (
        <div className="media-content">
          <img src={message.mediaUrl} alt="Media" className="message-media" />
        </div>
      ) : (
        <div className="message-content">{message.text}</div>
      )}
      
      <div className="message-time">{formatTime(message.timestamp)}</div>
      
      {message.reactions.length > 0 && (
        <div className="message-reactions">
          {message.reactions.map((reaction, index) => (
            <span key={index} className="reaction">{reaction.reaction}</span>
          ))}
        </div>
      )}
      
      <div className="message-actions">
        <button 
          className="action-btn"
          onClick={() => setReplyingTo({ id: message.id, text: message.text })}
        >
          ↩️
        </button>
        <div className="reaction-picker">
          <button 
            className="action-btn"
            onClick={() => setShowEmojiPicker(message.id)}
          >
            😊
          </button>
          {showEmojiPicker === message.id && (
            <div className="emoji-picker">
              {REACTIONS.map((reaction, index) => (
                <span 
                  key={index} 
                  className="emoji-option"
                  onClick={() => {
                    handleAddReaction(message.id, reaction);
                    setShowEmojiPicker(false);
                  }}
                >
                  {reaction}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
  // Render sticker picker
  const renderStickerPicker = () => (
    <div className="media-picker">
      <div className="picker-tabs">
        {STICKER_PACKS.map(pack => (
          <div key={pack.id} className="picker-tab">{pack.name}</div>
        ))}
      </div>
      <div className="picker-content">
        {STICKER_PACKS[0].stickers.map(sticker => (
          <div 
            key={sticker.id} 
            className="sticker-item"
            onClick={() => handleSendMedia(sticker.url, 'sticker')}
          >
            <img src={sticker.url} alt="Sticker" className="sticker-preview" />
          </div>
        ))}
      </div>
    </div>
  );
  
  // Render GIF picker
  const renderGifPicker = () => (
    <div className="media-picker">
      <div className="picker-search">
        <input type="text" placeholder="Search GIFs..." />
      </div>
      <div className="picker-content">
        {TRENDING_GIFS.map(gif => (
          <div 
            key={gif.id} 
            className="gif-item"
            onClick={() => handleSendMedia(gif.url, 'gif')}
          >
            <img src={gif.url} alt="GIF" className="gif-preview" />
          </div>
        ))}
      </div>
    </div>
  );
  
  // Main render
  return (
    <div className="App">
      {!isAuthenticated ? (
        showLogin ? renderLogin() : (
          <div className="welcome-screen">
            <h1>SoulLink</h1>
            <p className="tagline">Stay Connected, Always</p>
            <button className="start-btn" onClick={() => setShowLogin(true)}>Get Started</button>
          </div>
        )
      ) : (
        <div className="main-container">
          {renderChatList()}
          
          {activeContact ? (
            <div className="chat-container">
              <div className="chat-header">
                <div className="partner-info">
                  <img src={activeContact.avatar} alt={activeContact.name} className="avatar" />
                  <div className="partner-details">
                    <h2>{activeContact.name}</h2>
                    <div className="status">
                      {activeContact.isOnline ? (
                        <span className="online">● Online now</span>
                      ) : (
                        <span className="offline">Last seen {formatTime(activeContact.lastSeen)}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="header-actions">
                  <button className="action-icon">📞</button>
                  <button className="action-icon">📹</button>
                  <button className="action-icon">⋮</button>
                </div>
              </div>
              
              <div className="messages">
                {chatMessages[activeContact.id]?.map(message => renderMessage(message))}
                
                {isTyping && (
                  <div className="typing-indicator">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="language-selector">
                <select 
                  value={language} 
                  onChange={(e) => handleLanguageChange(e.target.value)}
                >
                  <option value="en-IN">English</option>
                  <option value="hi-IN">हिंदी</option>
                  <option value="ta-IN">தமிழ்</option>
                </select>
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
              
              {replyingTo && (
                <div className="reply-container">
                  <div className="reply-preview">
                    <div className="reply-text">
                      {chatMessages[activeContact.id].find(m => m.id === replyingTo.id)?.text}
                    </div>
                    <button 
                      className="cancel-reply"
                      onClick={() => setReplyingTo(null)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
              
              {showStickers && renderStickerPicker()}
              {showGifs && renderGifPicker()}
              
              <div className="message-input">
                <div className="input-actions">
                  <button 
                    className="action-icon"
                    onClick={() => {
                      setShowStickers(!showStickers);
                      setShowGifs(false);
                    }}
                  >
                    😊
                  </button>
                  <button 
                    className="action-icon"
                    onClick={() => {
                      setShowGifs(!showGifs);
                      setShowStickers(false);
                    }}
                  >
                    GIF
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button 
                  className="send-btn"
                  onClick={handleSendMessage}
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            <div className="no-chat-selected">
              <div className="welcome-message">
                <h2>Welcome to SoulLink</h2>
                <p>Select a chat to start messaging</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
