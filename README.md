# SoulLink - Stay Connected, Always

SoulLink is a messaging application designed to strengthen the emotional and spiritual bond between individuals in relationships. The app focuses on creating a deeply intuitive and responsive communication platform that helps couples and friends stay emotionally connected at all times—regardless of physical distance.

## Core Features

### Mobile App (React Native)

1. **Instant Presence Notification**
   - Receive notifications when your partner comes online
   - Gentle nudges to encourage communication

2. **Live Connection Pulse**
   - Visual indicator of partner's online status
   - Heartwarming animations representing emotional closeness

3. **Love Sparks (AI-powered Suggestions)**
   - Flirty lines
   - Thoughtful questions
   - Playful dares
   - Spiritual affirmations

4. **Advanced Chat Features**
   - Full-featured messaging system
   - Reply to specific messages
   - Emoji reactions
   - Typing indicators
   - Read receipts
   - Romantic UI themes

5. **Minimal Bandwidth Voice/Video Calls**
   - Optimized for low-bandwidth networks
   - Spiritual touch with calming tones or affirmations

### Web App (React.js)

1. **Multi-User Chat Support**
   - Chat with multiple contacts
   - Contact list with online status indicators
   - Unread message counters

2. **OTP-Based Authentication**
   - Phone number verification with OTP
   - Optional email OTP verification
   - Persistent login sessions

3. **Enhanced Chat Features**
   - Reply to specific messages
   - Emoji reactions to messages
   - GIF and sticker support
   - Typing indicators
   - Read receipts
   - Message timestamps

4. **Regional Language Support**
   - Support for multiple Indian languages
   - Hindi, Tamil, and more language options for Love Sparks

## Indian Market Focus

SoulLink is designed with the Indian market in mind:

- **Regional Language Support**: Hindi, Tamil, Telugu, and more
- **Low Bandwidth Optimization**: Works well on slower networks
- **Cultural Sensitivity**: Message suggestions tailored to Indian cultural contexts
- **Mobile-First Design**: Optimized for the devices most commonly used in India

## Security and Trust Model

- Connection only allowed if both users have saved each other's contact number
- End-to-end encryption for all chats and calls
- OTP-based authentication for enhanced security
- Optional spiritual reflection features

## Technical Stack

### Mobile App
- React Native / Expo
- TypeScript
- Socket.IO for real-time communication
- Expo Notifications for push notifications
- Expo Contacts for contact verification
- React Navigation for app navigation
- Encrypted Storage for secure data storage

### Web App
- React.js
- Socket.IO for real-time communication
- Axios for API requests
- Emoji-mart for emoji picker
- GIPHY API for GIF support

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Mobile App Installation

1. Clone the repository
   ```
   git clone https://github.com/rv-experiments/chinky-chats.git
   cd chinky-chats
   ```

2. Install dependencies
   ```
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```
   npm start
   # or
   yarn start
   ```

4. Run on a device or emulator
   - Scan the QR code with the Expo Go app (Android) or Camera app (iOS)
   - Press 'a' to run on an Android emulator
   - Press 'i' to run on an iOS simulator

### Web App Installation

1. Navigate to the web directory
   ```
   cd web
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:12000
   ```

## Project Structure

```
soullink/
├── src/                  # Mobile app source code
│   ├── components/       # Reusable UI components
│   ├── screens/          # App screens
│   ├── services/         # Business logic and API services
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript type definitions
│   ├── assets/           # Images, fonts, etc.
│   └── styles/           # Global styles
├── web/                  # Web app source code
│   ├── public/           # Static files
│   └── src/              # Source code
│       ├── App.js        # Main application component
│       └── App.css       # Styles
├── API_DOCUMENTATION_V2.md  # API documentation
├── App.tsx               # Main mobile app component
├── package.json          # Dependencies and scripts
└── README.md             # Project documentation
```

## API Documentation

For detailed API documentation, see [API_DOCUMENTATION_V2.md](API_DOCUMENTATION_V2.md).

## Future Enhancements (Planned)

- **Shared Journal**: Write daily feelings, share dreams, gratitude notes
- **Mood Sync**: Update each other about moods using emojis or AI-detected tone
- **Reminder System**: Gentle nudges for dates, anniversaries, or "time to talk" suggestions
- **Couple Goals Tracker**: Work together on relationship goals or rituals
- **Group Chat**: Create groups for family and friends
- **End-to-End Encryption**: Enhanced security for all communications
- **Cloud Backup**: Secure backup of chat history

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the need for deeper connection in relationships
- Designed to foster spiritual and emotional intimacy between partners
- Special focus on the Indian market and cultural context