import { LoveSpark } from '../../types/ChatTypes';
import { loveSparkApi } from '../../api';

/**
 * Adapter class that maintains the existing LoveSparkService interface
 * while using the new API implementation under the hood
 */
export class LoveSparkService {
  // Get love sparks by category
  static async getLoveSparks(category: 'flirty' | 'thoughtful' | 'playful' | 'spiritual'): Promise<LoveSpark[]> {
    try {
      // Call API to get love sparks
      const response = await loveSparkApi.getLoveSparks(category);
      
      // Convert API love sparks to app LoveSpark type
      return response.sparks.map(spark => ({
        id: spark.id,
        text: spark.content,
        category: spark.category as 'flirty' | 'thoughtful' | 'playful' | 'spiritual',
        usedCount: 0 // API doesn't provide this, so default to 0
      }));
    } catch (error) {
      console.error('Error getting love sparks:', error);
      
      // Fall back to hardcoded sparks if API fails
      return this.getFallbackSparks(category);
    }
  }

  // Get personalized love sparks based on chat history
  static async getPersonalizedSparks(chatHistory: string[]): Promise<LoveSpark[]> {
    try {
      // In a real implementation, we would analyze the chat history on the server
      // For now, we'll just get a mix of sparks from different categories
      
      const allCategories: ('flirty' | 'thoughtful' | 'playful' | 'spiritual')[] = [
        'flirty', 'thoughtful', 'playful', 'spiritual'
      ];
      
      const personalizedSparks: LoveSpark[] = [];
      
      // Get one spark from each category
      for (const category of allCategories) {
        const categorySparks = await this.getLoveSparks(category);
        if (categorySparks.length > 0) {
          const randomIndex = Math.floor(Math.random() * categorySparks.length);
          personalizedSparks.push(categorySparks[randomIndex]);
        }
      }
      
      return personalizedSparks;
    } catch (error) {
      console.error('Error getting personalized sparks:', error);
      
      // Fall back to a mix of hardcoded sparks if API fails
      const personalizedSparks: LoveSpark[] = [];
      
      const allCategories: ('flirty' | 'thoughtful' | 'playful' | 'spiritual')[] = [
        'flirty', 'thoughtful', 'playful', 'spiritual'
      ];
      
      // Get one spark from each category
      allCategories.forEach(category => {
        const categorySparks = this.getFallbackSparks(category);
        if (categorySparks.length > 0) {
          const randomIndex = Math.floor(Math.random() * categorySparks.length);
          personalizedSparks.push(categorySparks[randomIndex]);
        }
      });
      
      return personalizedSparks;
    }
  }

  // Track usage of a love spark
  static async trackSparkUsage(sparkId: string): Promise<void> {
    try {
      // Call API to rate the spark (5 = used)
      await loveSparkApi.rateLoveSpark(sparkId, { rating: 5 });
    } catch (error) {
      console.error('Error tracking spark usage:', error);
      // Just log the error, don't throw
    }
  }

  // Get fallback sparks if API fails
  private static getFallbackSparks(category: 'flirty' | 'thoughtful' | 'playful' | 'spiritual'): LoveSpark[] {
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
}