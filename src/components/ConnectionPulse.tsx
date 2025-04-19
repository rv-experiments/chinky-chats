import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ConnectionPulseProps {
  isOnline: boolean;
  name: string;
}

export const ConnectionPulse: React.FC<ConnectionPulseProps> = ({ isOnline, name }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    if (isOnline) {
      // Create a pulsing animation when partner is online
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          })
        ])
      ).start();
    } else {
      // Stop animation when offline
      pulseAnim.setValue(1);
    }
  }, [isOnline, pulseAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <Animated.View 
          style={[
            styles.pulseCircle,
            { 
              backgroundColor: isOnline ? '#4CAF50' : '#9e9e9e',
              transform: [{ scale: isOnline ? pulseAnim : 1 }]
            }
          ]}
        />
        <View 
          style={[
            styles.statusDot,
            { backgroundColor: isOnline ? '#4CAF50' : '#9e9e9e' }
          ]}
        />
      </View>
      
      <Text style={styles.statusText}>
        {isOnline 
          ? `${name} is online and thinking of you` 
          : `${name} is currently offline`}
      </Text>
      
      {isOnline && (
        <View style={styles.heartContainer}>
          <Ionicons name="heart" size={16} color="#e91e63" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  statusContainer: {
    position: 'relative',
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseCircle: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    opacity: 0.3,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  heartContainer: {
    marginLeft: 8,
  },
});