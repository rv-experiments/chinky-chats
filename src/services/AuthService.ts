import * as Contacts from 'expo-contacts';
import EncryptedStorage from 'react-native-encrypted-storage';
import { User } from '../types/ChatTypes';

export class AuthService {
  // Check if user is already authenticated
  static async isAuthenticated(): Promise<boolean> {
    try {
      const session = await EncryptedStorage.getItem("user_session");
      return session !== null;
    } catch (error) {
      console.error('Error checking authentication status:', error);
      return false;
    }
  }

  // Authenticate user with phone number
  static async authenticate(phoneNumber: string, partnerNumber: string): Promise<User | null> {
    try {
      // In a real app, this would make an API call to verify the phone number
      // For demo purposes, we'll simulate a successful authentication
      
      // Check if partner number is in contacts
      const isPartnerInContacts = await this.checkIfNumberInContacts(partnerNumber);
      
      if (!isPartnerInContacts) {
        throw new Error('Partner number not found in contacts');
      }
      
      // Create a user object
      const user: User = {
        id: 'user_' + Date.now().toString(),
        name: 'User', // In a real app, this would be fetched from the server
        phoneNumber: phoneNumber,
      };
      
      // Store user session
      await EncryptedStorage.setItem(
        "user_session",
        JSON.stringify({
          user,
          partnerNumber,
          token: 'dummy_token_' + Date.now().toString(),
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
      const session = await EncryptedStorage.getItem("user_session");
      
      if (!session) {
        return null;
      }
      
      const { user } = JSON.parse(session);
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Get partner number
  static async getPartnerNumber(): Promise<string | null> {
    try {
      const session = await EncryptedStorage.getItem("user_session");
      
      if (!session) {
        return null;
      }
      
      const { partnerNumber } = JSON.parse(session);
      return partnerNumber;
    } catch (error) {
      console.error('Error getting partner number:', error);
      return null;
    }
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      await EncryptedStorage.removeItem("user_session");
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
}