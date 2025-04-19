import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import ChatScreen from './src/screens/ChatScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Create the stack navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator 
          initialRouteName="Welcome"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f8e1e8', // Soft pink for romantic theme
            },
            headerTintColor: '#5e3b70', // Purple for contrast
            headerTitleStyle: {
              fontWeight: '600',
            },
          }}
        >
          <Stack.Screen 
            name="Welcome" 
            component={WelcomeScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ title: 'Connect Your Soul' }}
          />
          <Stack.Screen 
            name="Chat" 
            component={ChatScreen} 
            options={({ route }) => ({ title: route.params?.partnerName || 'Soul Chat' })}
          />
          <Stack.Screen 
            name="Profile" 
            component={ProfileScreen} 
            options={{ title: 'Your Profile' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}