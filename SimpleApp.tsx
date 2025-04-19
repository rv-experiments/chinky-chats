import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar, Image, ScrollView } from 'react-native';

export default function SimpleApp() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image 
            source={require('./src/assets/icon.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>SoulLink</Text>
          <Text style={styles.subtitle}>Stay Connected, Always</Text>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>About SoulLink</Text>
          <Text style={styles.paragraph}>
            SoulLink is a deeply intuitive and responsive communication platform that helps couples 
            stay emotionally connected at all times—regardless of physical distance—through gentle 
            nudges, engaging features, and meaningful conversations.
          </Text>
          
          <Text style={styles.sectionTitle}>Core Features</Text>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>Instant Presence Notification</Text>
            <Text style={styles.featureDescription}>
              Get notified when your partner comes online with personalized messages.
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>Live Connection Pulse</Text>
            <Text style={styles.featureDescription}>
              See when your partner is active with heartwarming animations.
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>Romantic Suggestions</Text>
            <Text style={styles.featureDescription}>
              AI-powered "Love Sparks" offers flirty lines, thoughtful questions, and more.
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>Advanced Chat Features</Text>
            <Text style={styles.featureDescription}>
              Full-featured messaging with reactions, typing indicators, and more.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8e1e8',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginVertical: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5e3b70',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#5e3b70',
    fontStyle: 'italic',
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#5e3b70',
    marginBottom: 10,
    marginTop: 20,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 20,
  },
  featureItem: {
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: '#5e3b70',
    paddingLeft: 10,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#5e3b70',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});