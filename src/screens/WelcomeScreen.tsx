import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground 
      source={require('../assets/background.png')} // You'll need to add this image
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>SoulLink</Text>
          <Text style={styles.tagline}>Stay Connected, Always</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Connect with Your Partner</Text>
          </TouchableOpacity>
          
          <Text style={styles.infoText}>
            SoulLink connects couples who have saved each other's contact numbers,
            ensuring trust and authenticity in your relationship.
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#5e3b70',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18,
    color: '#5e3b70',
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#5e3b70',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    paddingHorizontal: 20,
  },
});

export default WelcomeScreen;