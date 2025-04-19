/**
 * Mock Love Spark Service
 * 
 * Provides mock implementations of love spark service methods for development.
 */

import { LoveSpark } from '../loveSparkService';

// Mock love sparks by category
const mockLoveSparks: Record<string, LoveSpark[]> = {
  flirty: [
    {
      id: 'spark-1',
      content: 'You look amazing today... well, every day actually.',
      category: 'flirty',
    },
    {
      id: 'spark-2',
      content: 'Just saw something that reminded me of your smile.',
      category: 'flirty',
    },
    {
      id: 'spark-3',
      content: 'If you were a vegetable, you'd be a cute-cumber.',
      category: 'flirty',
    },
    {
      id: 'spark-4',
      content: 'Is it hot in here or is it just you?',
      category: 'flirty',
    },
    {
      id: 'spark-5',
      content: 'I can't stop thinking about our last kiss.',
      category: 'flirty',
    },
  ],
  thoughtful: [
    {
      id: 'spark-6',
      content: 'What's one thing you're grateful for today?',
      category: 'thoughtful',
    },
    {
      id: 'spark-7',
      content: 'What's your favorite memory of us together?',
      category: 'thoughtful',
    },
    {
      id: 'spark-8',
      content: 'If we could travel anywhere right now, where would you want to go?',
      category: 'thoughtful',
    },
    {
      id: 'spark-9',
      content: 'What's something you're looking forward to this week?',
      category: 'thoughtful',
    },
    {
      id: 'spark-10',
      content: 'How can I make your day better today?',
      category: 'thoughtful',
    },
  ],
  playful: [
    {
      id: 'spark-11',
      content: 'Truth or dare? You go first!',
      category: 'playful',
    },
    {
      id: 'spark-12',
      content: 'Let's play 20 questions. I'm thinking of something...',
      category: 'playful',
    },
    {
      id: 'spark-13',
      content: 'Would you rather have superpowers or be a billionaire?',
      category: 'playful',
    },
    {
      id: 'spark-14',
      content: 'Quick! Send me a selfie of what you're doing right now.',
      category: 'playful',
    },
    {
      id: 'spark-15',
      content: 'If you were a superhero, what would your power be?',
      category: 'playful',
    },
  ],
  spiritual: [
    {
      id: 'spark-16',
      content: 'Take a deep breath with me. Inhale... exhale...',
      category: 'spiritual',
    },
    {
      id: 'spark-17',
      content: 'What's something that brought you peace today?',
      category: 'spiritual',
    },
    {
      id: 'spark-18',
      content: 'Let's take a moment to be grateful for our connection.',
      category: 'spiritual',
    },
    {
      id: 'spark-19',
      content: 'What's one thing you'd like to manifest in our relationship?',
      category: 'spiritual',
    },
    {
      id: 'spark-20',
      content: 'I'm sending you positive energy and love right now.',
      category: 'spiritual',
    },
  ],
  gratitude: [
    {
      id: 'spark-21',
      content: 'I'm so grateful for your patience and understanding.',
      category: 'gratitude',
    },
    {
      id: 'spark-22',
      content: 'Thank you for always being there for me.',
      category: 'gratitude',
    },
    {
      id: 'spark-23',
      content: 'I appreciate the way you [specific quality].',
      category: 'gratitude',
    },
    {
      id: 'spark-24',
      content: 'You've made such a positive impact on my life.',
      category: 'gratitude',
    },
    {
      id: 'spark-25',
      content: 'I'm thankful for every moment we share together.',
      category: 'gratitude',
    },
  ],
};

// Flatten all sparks for when no category is specified
const allSparks = Object.values(mockLoveSparks).flat();

export const mockLoveSparkService = {
  getLoveSparks: async (
    category?: 'flirty' | 'thoughtful' | 'playful' | 'spiritual' | 'gratitude',
    limit: number = 5
  ): Promise<LoveSpark[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get sparks based on category
    let sparks: LoveSpark[];
    if (category) {
      sparks = [...mockLoveSparks[category]];
    } else {
      // If no category specified, return random sparks from all categories
      sparks = [...allSparks];
    }
    
    // Shuffle array
    sparks.sort(() => Math.random() - 0.5);
    
    // Apply limit
    return sparks.slice(0, limit);
  },

  rateLoveSpark: async (
    sparkId: string,
    rating: number
  ): Promise<{ success: boolean }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, this would store the rating on the server
    return {
      success: true,
    };
  },
};