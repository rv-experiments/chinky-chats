import * as Contacts from 'expo-contacts';
import EncryptedStorage from 'react-native-encrypted-storage';
import { User } from '../../types/ChatTypes';
import { authApi, userApi } from '../../api';

/**
 * Adapter class that maintains the existing AuthService interface
 * while using the new API implementation under the hood
 */
export class AuthService {
  // Check if user is already authenticated
  static async isAuthenticated(): Promise<boolean> {
    try {
      return await authApi.isAuthenticated();
    } catch (error) {
      console.error('Error checking authentication status:', error);
      return false;
    }
  }

  // Authenticate user with phone number
  static async authenticate(phoneNumber: string, partnerNumber: string): Promise<User | null> {
    try {
      // Check if partner number is in contacts
      const isPartnerInContacts = await this.checkIfNumberInContacts(partnerNumber);
      
      if (!isPartnerInContacts) {
        throw new Error('Partner number not found in contacts');
      }
      
      // Register or login the user
      const deviceId = `device_${Date.now()}`;
      const loginResponse = await authApi.login({
        phoneNumber,
        deviceId,
      });
      
      if (!loginResponse.success || !loginResponse.verificationSent) {
        throw new Error('Failed to send verification code');
      }
      
      // Note: In a real implementation, we would wait for the user to enter the verification code
      // For demo purposes, we'll simulate a successful verification
      
      // Store partner number in encrypted storage for later use
      await EncryptedStorage.setItem(
        "partner_number",
        partnerNumber
      );
      
      // Create a user object
      const user: User = {
        id: loginResponse.userId || 'user_' + Date.now().toString(),
        name: 'User', // In a real app, this would be fetched from the server
        phoneNumber: phoneNumber,
      };
      
      // Store user in encrypted storage
      await EncryptedStorage.setItem(
        "user_session",
        JSON.stringify({
          user,
          partnerNumber,
        })
      );
      
      return user;
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  }

  // Check if a phone number exists in contacts
  static async checkIfNumberInContacts(phoneNumber: string): Promise<boolean> {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      
      if (status !== 'granted') {
        return false;
      }
      
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });
      
      if (data.length > 0) {
        // Normalize the phone number for comparison
        const normalizedSearchNumber = this.normalizePhoneNumber(phoneNumber);
        
        // Check if any contact has the phone number
        return data.some(contact => {
          if (!contact.phoneNumbers) return false;
          
          return contact.phoneNumbers.some(phone => {
            const normalizedContactNumber = this.normalizePhoneNumber(phone.number || '');
            return normalizedContactNumber === normalizedSearchNumber;
          });
        });
      }
      
      return false;
    } catch (error) {
      console.error('Error checking contacts:', error);
      return false;
    }
  }

  // Normalize phone number for comparison (remove spaces, dashes, etc.)
  static normalizePhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/\D/g, '');
  }

  // Get current user
  static async getCurrentUser(): Promise<User | null> {
    try {
      // First try to get from API
      try {
        const apiUser = await userApi.getProfile();
        
        // Convert API user to app User type
        const user: User = {
          id: apiUser.id,
          name: apiUser.name,
          phoneNumber: apiUser.phoneNumber,
          profilePicture: apiUser.profilePicture,
          status: apiUser.status,
          lastSeen: apiUser.lastSeen,
        };
        
        return user;
      } catch (apiError) {
        // If API fails, fall back to local storage
        console.log('API error, falling back to local storage:', apiError);
        
        const session = await EncryptedStorage.getItem("user_session");
        
        if (!session) {
          return null;
        }
        
        const { user } = JSON.parse(session);
        return user;
      }
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Get partner number
  static async getPartnerNumber(): Promise<string | null> {
    try {
      // First try to get from encrypted storage
      const partnerNumber = await EncryptedStorage.getItem("partner_number");
      
      if (partnerNumber) {
        return partnerNumber;
      }
      
      // If not found in dedicated storage, try from session
      const session = await EncryptedStorage.getItem("user_session");
      
      if (!session) {
        return null;
      }
      
      const { partnerNumber: sessionPartnerNumber } = JSON.parse(session);
      return sessionPartnerNumber;
    } catch (error) {
      console.error('Error getting partner number:', error);
      return null;
    }
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      // Call API logout
      await authApi.logout();
      
      // Clear local storage
      await EncryptedStorage.removeItem("user_session");
      await EncryptedStorage.removeItem("partner_number");
    } catch (error) {
      console.error('Error during logout:', error);
      
      // Still clear local storage even if API call fails
      await EncryptedStorage.removeItem("user_session");
      await EncryptedStorage.removeItem("partner_number");
    }
  }
}