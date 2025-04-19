import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ChatMessage } from '../types/ChatTypes';
import { ConnectionPulse } from '../components/ConnectionPulse';
import { LoveSparks } from '../components/LoveSparks';

const ChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { partnerName, partnerNumber } = route.params || {};
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    // Sample messages for demonstration
    {
      id: '1',
      text: 'Hi there! I'm thinking about you today.',
      sender: 'partner',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: true
    },
    {
      id: '2',
      text: 'That's so sweet! I've been thinking about you too.',
      sender: 'self',
      timestamp: new Date(Date.now() - 3500000).toISOString(),
      read: true
    },
    {
      id: '3',
      text: 'What are you up to this evening?',
      sender: 'partner',
      timestamp: new Date(Date.now() - 3400000).toISOString(),
      read: true
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isPartnerOnline, setIsPartnerOnline] = useState(true);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const flatListRef = useRef(null);

  // Simulate partner coming online/offline
  useEffect(() => {
    const onlineInterval = setInterval(() => {
      setIsPartnerOnline(prev => !prev);
      
      if (!isPartnerOnline) {
        // Partner just came online, show notification
        // In a real app, this would be handled by push notifications
        console.log(`${partnerName} is online and may be thinking of you`);
      }
    }, 30000); // Change online status every 30 seconds for demo
    
    return () => clearInterval(onlineInterval);
  }, [isPartnerOnline, partnerName]);

  // Animate the connection pulse
  useEffect(() => {
    if (isPartnerOnline) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          })
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isPartnerOnline, pulseAnim]);

  // Simulate partner typing
  useEffect(() => {
    if (isPartnerOnline) {
      const typingInterval = setInterval(() => {
        const shouldType = Math.random() > 0.7;
        setIsPartnerTyping(shouldType);
        
        if (shouldType) {
          // Partner starts typing
          setTimeout(() => {
            setIsPartnerTyping(false);
            
            // 50% chance to send a message after typing
            if (Math.random() > 0.5) {
              const newPartnerMessage = {
                id: Date.now().toString(),
                text: 'I miss you! How's your day going?',
                sender: 'partner',
                timestamp: new Date().toISOString(),
                read: false
              };
              
              setMessages(prev => [...prev, newPartnerMessage]);
            }
          }, 3000);
        }
      }, 15000);
      
      return () => clearInterval(typingInterval);
    }
  }, [isPartnerOnline]);

  const sendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: 'self',
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setShowSuggestions(false);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isSelf = item.sender === 'self';
    
    return (
      <View style={[
        styles.messageContainer,
        isSelf ? styles.selfMessageContainer : styles.partnerMessageContainer
      ]}>
        <View style={[
          styles.messageBubble,
          isSelf ? styles.selfMessageBubble : styles.partnerMessageBubble
        ]}>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {isSelf && item.read && ' ✓✓'}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <ConnectionPulse isOnline={isPartnerOnline} name={partnerName} />
      </View>
      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      
      {isPartnerTyping && (
        <View style={styles.typingContainer}>
          <Text style={styles.typingText}>{partnerName} is typing...</Text>
          <ActivityIndicator size="small" color="#5e3b70" />
        </View>
      )}
      
      {showSuggestions && (
        <LoveSparks 
          onSelectSuggestion={(suggestion) => {
            setNewMessage(suggestion);
            setShowSuggestions(false);
          }}
        />
      )}
      
      <View style={styles.inputContainer}>
        <TouchableOpacity 
          style={styles.suggestionButton}
          onPress={() => setShowSuggestions(!showSuggestions)}
        >
          <Ionicons name="heart" size={24} color="#5e3b70" />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
        />
        
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={sendMessage}
          disabled={newMessage.trim() === ''}
        >
          <Ionicons 
            name="send" 
            size={24} 
            color={newMessage.trim() === '' ? '#ccc' : '#5e3b70'} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  messagesContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  messageContainer: {
    marginVertical: 5,
    maxWidth: '80%',
  },
  selfMessageContainer: {
    alignSelf: 'flex-end',
  },
  partnerMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
  },
  selfMessageBubble: {
    backgroundColor: '#e1d4f0',
    borderBottomRightRadius: 5,
  },
  partnerMessageBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: '#eee',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    marginHorizontal: 4,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f0f0f0',
  },
  typingText: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  suggestionButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 8,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
  },
});

export default ChatScreen;