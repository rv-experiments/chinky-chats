import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Contacts from 'expo-contacts';
import { AuthService } from '../services/AuthService';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [partnerNumber, setPartnerNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [contactsPermission, setContactsPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      setContactsPermission(status === 'granted');
      
      if (status === 'granted') {
        // Could pre-fill partner number if found in contacts
        // This is just a placeholder for the actual implementation
      }
    })();
  }, []);

  const handleConnect = async () => {
    if (!phoneNumber || !partnerNumber) {
      Alert.alert('Missing Information', 'Please enter both phone numbers');
      return;
    }
    
    setLoading(true);
    
    try {
      // This would be replaced with actual authentication logic
      // For now, we'll simulate a successful connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if partner has saved user's number (in a real app)
      const partnerHasSavedUser = true; // Simulated for demo
      
      if (partnerHasSavedUser) {
        navigation.navigate('Chat', { 
          partnerNumber,
          partnerName: 'Your Partner', // In a real app, this would be fetched from contacts
        });
      } else {
        Alert.alert(
          'Connection Not Possible',
          'SoulLink requires both partners to have saved each other\'s contact numbers for security and trust.'
        );
      }
    } catch (error) {
      Alert.alert('Connection Error', 'Could not establish connection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect Your Hearts</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Your Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="+1 (123) 456-7890"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          autoCompleteType="tel"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Your Partner's Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="+1 (123) 456-7890"
          value={partnerNumber}
          onChangeText={setPartnerNumber}
          keyboardType="phone-pad"
          autoCompleteType="tel"
        />
      </View>
      
      {!contactsPermission && (
        <Text style={styles.permissionText}>
          SoulLink works best with contacts permission to verify your connection.
        </Text>
      )}
      
      <TouchableOpacity 
        style={styles.connectButton}
        onPress={handleConnect}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.connectButtonText}>Connect Souls</Text>
        )}
      </TouchableOpacity>
      
      <Text style={styles.securityNote}>
        For your security and privacy, SoulLink only connects partners who have saved each other's contact numbers.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#5e3b70',
    marginTop: 40,
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#5e3b70',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  permissionText: {
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
  },
  connectButton: {
    backgroundColor: '#5e3b70',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  connectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  securityNote: {
    color: '#888',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 14,
    paddingHorizontal: 20,
  },
});

export default LoginScreen;