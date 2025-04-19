import apiClient from './apiClient';

// Types
export interface LoveSpark {
  id: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetLoveSparksResponse {
  success: boolean;
  sparks: LoveSpark[];
  message?: string;
}

export interface RateLoveSparkRequest {
  rating: number; // 1-5
}

export interface RateLoveSparkResponse {
  success: boolean;
  message?: string;
}

export interface CreateLoveSparkRequest {
  content: string;
  category: string;
}

export interface CreateLoveSparkResponse {
  success: boolean;
  spark?: LoveSpark;
  message?: string;
}

// LoveSpark API service
export const loveSparkApi = {
  // Get love sparks by category
  async getLoveSparks(category: string): Promise<GetLoveSparksResponse> {
    return apiClient.get<GetLoveSparksResponse>('/lovespark', { params: { category } });
  },

  // Get personalized love sparks
  async getPersonalizedSparks(): Promise<GetLoveSparksResponse> {
    return apiClient.get<GetLoveSparksResponse>('/lovespark/personalized');
  },

  // Rate a love spark
  async rateLoveSpark(sparkId: string, data: RateLoveSparkRequest): Promise<RateLoveSparkResponse> {
    return apiClient.post<RateLoveSparkResponse>(`/lovespark/${sparkId}/rate`, data);
  },

  // Create a custom love spark
  async createLoveSpark(data: CreateLoveSparkRequest): Promise<CreateLoveSparkResponse> {
    return apiClient.post<CreateLoveSparkResponse>('/lovespark', data);
  },

  // Delete a custom love spark
  async deleteLoveSpark(sparkId: string): Promise<{ success: boolean; message?: string }> {
    return apiClient.delete<{ success: boolean; message?: string }>(`/lovespark/${sparkId}`);
  }
};

export default loveSparkApi;