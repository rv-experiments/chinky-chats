import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LoveSparksProps {
  onSelectSuggestion: (suggestion: string) => void;
}

export const LoveSparks: React.FC<LoveSparksProps> = ({ onSelectSuggestion }) => {
  const [category, setCategory] = useState<'flirty' | 'thoughtful' | 'playful' | 'spiritual'>('flirty');
  
  // Sample suggestions for each category
  const suggestions = {
    flirty: [
      "You've been on my mind all day 💭",
      "Missing your touch right now... 💋",
      "Can't wait to see you again ❤️",
      "Just thinking about your smile made my day better 😊",
      "You're the best part of my every day 💫"
    ],
    thoughtful: [
      "How are you feeling today? I'm here to listen 💗",
      "What was the highlight of your day?",
      "Is there anything I can do to make your day better?",
      "I appreciate you so much for being you 🙏",
      "Thank you for always being there for me"
    ],
    playful: [
      "Truth or dare? 😏",
      "What would you do if I was there right now? 😉",
      "Let's plan something fun for the weekend!",
      "Random question: What superpower would you choose?",
      "Would you rather... (beach vacation or mountain retreat)?"
    ],
    spiritual: [
      "I feel our souls are connected across any distance 🌌",
      "Sending you peaceful energy today 🕊️",
      "Taking a moment to be grateful for having you in my life",
      "Our connection transcends the physical world ✨",
      "I believe our paths were meant to cross in this lifetime 🙏"
    ]
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Love Sparks</Text>
        <Text style={styles.subtitle}>Ignite your conversation</Text>
      </View>
      
      <View style={styles.categoryTabs}>
        <TouchableOpacity 
          style={[styles.categoryTab, category === 'flirty' && styles.activeTab]}
          onPress={() => setCategory('flirty')}
        >
          <Ionicons 
            name="flame" 
            size={16} 
            color={category === 'flirty' ? '#e91e63' : '#888'} 
          />
          <Text style={[styles.categoryText, category === 'flirty' && styles.activeText]}>
            Flirty
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.categoryTab, category === 'thoughtful' && styles.activeTab]}
          onPress={() => setCategory('thoughtful')}
        >
          <Ionicons 
            name="heart-circle" 
            size={16} 
            color={category === 'thoughtful' ? '#e91e63' : '#888'} 
          />
          <Text style={[styles.categoryText, category === 'thoughtful' && styles.activeText]}>
            Thoughtful
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.categoryTab, category === 'playful' && styles.activeTab]}
          onPress={() => setCategory('playful')}
        >
          <Ionicons 
            name="happy" 
            size={16} 
            color={category === 'playful' ? '#e91e63' : '#888'} 
          />
          <Text style={[styles.categoryText, category === 'playful' && styles.activeText]}>
            Playful
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.categoryTab, category === 'spiritual' && styles.activeTab]}
          onPress={() => setCategory('spiritual')}
        >
          <Ionicons 
            name="sparkles" 
            size={16} 
            color={category === 'spiritual' ? '#e91e63' : '#888'} 
          />
          <Text style={[styles.categoryText, category === 'spiritual' && styles.activeText]}>
            Spiritual
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.suggestionsContainer}>
        {suggestions[category].map((suggestion, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.suggestionItem}
            onPress={() => onSelectSuggestion(suggestion)}
          >
            <Text style={styles.suggestionText}>{suggestion}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    maxHeight: 250,
  },
  header: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5e3b70',
  },
  subtitle: {
    fontSize: 12,
    color: '#888',
  },
  categoryTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#e91e63',
  },
  categoryText: {
    fontSize: 14,
    color: '#888',
    marginLeft: 4,
  },
  activeText: {
    color: '#e91e63',
    fontWeight: '500',
  },
  suggestionsContainer: {
    padding: 10,
  },
  suggestionItem: {
    backgroundColor: '#f8f0f8',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f0e0f0',
  },
  suggestionText: {
    fontSize: 14,
    color: '#5e3b70',
  },
});