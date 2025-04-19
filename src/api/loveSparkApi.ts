import { apiService } from './apiClient';

// Types
export interface LoveSpark {
  id: string;
  content: string;
  category: 'flirty' | 'thoughtful' | 'playful' | 'spiritual' | 'gratitude';
}

export interface GetLoveSparksResponse {
  sparks: LoveSpark[];
}

export interface RateLoveSparkRequest {
  rating: number; // 1-5 scale
}

// LoveSpark API service
const loveSparkApi = {
  // Get love spark suggestions
  getLoveSparks: async (
    category?: 'flirty' | 'thoughtful' | 'playful' | 'spiritual' | 'gratitude',
    limit = 5
  ): Promise<GetLoveSparksResponse> => {
    let url = `/lovesparks?limit=${limit}`;
    if (category) {
      url += `&category=${category}`;
    }
    return apiService.get<GetLoveSparksResponse>(url);
  },
  
  // Rate a love spark
  rateLoveSpark: async (sparkId: string, data: RateLoveSparkRequest): Promise<{ success: boolean }> => {
    return apiService.post<{ success: boolean }>(`/lovesparks/${sparkId}/rate`, data);
  },
};

export default loveSparkApi;