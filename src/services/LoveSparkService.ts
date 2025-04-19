import { LoveSpark } from '../types/ChatTypes';

export class LoveSparkService {
  // Get love sparks by category
  static getLoveSparks(category: 'flirty' | 'thoughtful' | 'playful' | 'spiritual'): LoveSpark[] {
    // In a real app, these would be fetched from an API or database
    // For demo purposes, we'll return hardcoded sparks
    
    const sparks: Record<string, LoveSpark[]> = {
      flirty: [
        {
          id: 'flirty_1',
          text: "You've been on my mind all day 💭",
          category: 'flirty',
          usedCount: 0
        },
        {
          id: 'flirty_2',
          text: "Missing your touch right now... 💋",
          category: 'flirty',
          usedCount: 0
        },
        {
          id: 'flirty_3',
          text: "Can't wait to see you again ❤️",
          category: 'flirty',
          usedCount: 0
        },
        {
          id: 'flirty_4',
          text: "Just thinking about your smile made my day better 😊",
          category: 'flirty',
          usedCount: 0
        },
        {
          id: 'flirty_5',
          text: "You're the best part of my every day 💫",
          category: 'flirty',
          usedCount: 0
        }
      ],
      thoughtful: [
        {
          id: 'thoughtful_1',
          text: "How are you feeling today? I'm here to listen 💗",
          category: 'thoughtful',
          usedCount: 0
        },
        {
          id: 'thoughtful_2',
          text: "What was the highlight of your day?",
          category: 'thoughtful',
          usedCount: 0
        },
        {
          id: 'thoughtful_3',
          text: "Is there anything I can do to make your day better?",
          category: 'thoughtful',
          usedCount: 0
        },
        {
          id: 'thoughtful_4',
          text: "I appreciate you so much for being you 🙏",
          category: 'thoughtful',
          usedCount: 0
        },
        {
          id: 'thoughtful_5',
          text: "Thank you for always being there for me",
          category: 'thoughtful',
          usedCount: 0
        }
      ],
      playful: [
        {
          id: 'playful_1',
          text: "Truth or dare? 😏",
          category: 'playful',
          usedCount: 0
        },
        {
          id: 'playful_2',
          text: "What would you do if I was there right now? 😉",
          category: 'playful',
          usedCount: 0
        },
        {
          id: 'playful_3',
          text: "Let's plan something fun for the weekend!",
          category: 'playful',
          usedCount: 0
        },
        {
          id: 'playful_4',
          text: "Random question: What superpower would you choose?",
          category: 'playful',
          usedCount: 0
        },
        {
          id: 'playful_5',
          text: "Would you rather... (beach vacation or mountain retreat)?",
          category: 'playful',
          usedCount: 0
        }
      ],
      spiritual: [
        {
          id: 'spiritual_1',
          text: "I feel our souls are connected across any distance 🌌",
          category: 'spiritual',
          usedCount: 0
        },
        {
          id: 'spiritual_2',
          text: "Sending you peaceful energy today 🕊️",
          category: 'spiritual',
          usedCount: 0
        },
        {
          id: 'spiritual_3',
          text: "Taking a moment to be grateful for having you in my life",
          category: 'spiritual',
          usedCount: 0
        },
        {
          id: 'spiritual_4',
          text: "Our connection transcends the physical world ✨",
          category: 'spiritual',
          usedCount: 0
        },
        {
          id: 'spiritual_5',
          text: "I believe our paths were meant to cross in this lifetime 🙏",
          category: 'spiritual',
          usedCount: 0
        }
      ]
    };
    
    return sparks[category] || [];
  }

  // Get personalized love sparks based on chat history
  static getPersonalizedSparks(chatHistory: string[]): LoveSpark[] {
    // In a real app, this would analyze the chat history and return personalized suggestions
    // For demo purposes, we'll return a mix of sparks from different categories
    
    const allCategories: ('flirty' | 'thoughtful' | 'playful' | 'spiritual')[] = [
      'flirty', 'thoughtful', 'playful', 'spiritual'
    ];
    
    const personalizedSparks: LoveSpark[] = [];
    
    // Get one spark from each category
    allCategories.forEach(category => {
      const categorySparks = this.getLoveSparks(category);
      if (categorySparks.length > 0) {
        const randomIndex = Math.floor(Math.random() * categorySparks.length);
        personalizedSparks.push(categorySparks[randomIndex]);
      }
    });
    
    return personalizedSparks;
  }

  // Track usage of a love spark
  static trackSparkUsage(sparkId: string): void {
    // In a real app, this would update the usage count in a database
    console.log(`Spark ${sparkId} was used`);
  }
}