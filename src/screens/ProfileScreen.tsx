import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Switch, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [presenceEnabled, setPresenceEnabled] = useState(true);
  const [readReceiptsEnabled, setReadReceiptsEnabled] = useState(true);
  const [spiritualRemindersEnabled, setSpiritualRemindersEnabled] = useState(false);
  
  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to disconnect from SoulLink?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => navigation.navigate('Welcome'),
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Image
            source={require('../assets/profile-placeholder.png')} // You'll need to add this image
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editImageButton}>
            <Ionicons name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.profileName}>Your Name</Text>
        <Text style={styles.profilePhone}>+1 (123) 456-7890</Text>
        
        <View style={styles.connectionInfo}>
          <Text style={styles.connectionLabel}>Connected with:</Text>
          <Text style={styles.partnerName}>Your Partner</Text>
        </View>
      </View>
      
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Notification Settings</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Presence Notifications</Text>
            <Text style={styles.settingDescription}>
              Notify when your partner comes online
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#d1d1d1', true: '#c4b0d9' }}
            thumbColor={notificationsEnabled ? '#5e3b70' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Show My Presence</Text>
            <Text style={styles.settingDescription}>
              Let your partner know when you're online
            </Text>
          </View>
          <Switch
            value={presenceEnabled}
            onValueChange={setPresenceEnabled}
            trackColor={{ false: '#d1d1d1', true: '#c4b0d9' }}
            thumbColor={presenceEnabled ? '#5e3b70' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Read Receipts</Text>
            <Text style={styles.settingDescription}>
              Show when you've read messages
            </Text>
          </View>
          <Switch
            value={readReceiptsEnabled}
            onValueChange={setReadReceiptsEnabled}
            trackColor={{ false: '#d1d1d1', true: '#c4b0d9' }}
            thumbColor={readReceiptsEnabled ? '#5e3b70' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Spiritual Reminders</Text>
            <Text style={styles.settingDescription}>
              Receive gentle reminders about love and presence
            </Text>
          </View>
          <Switch
            value={spiritualRemindersEnabled}
            onValueChange={setSpiritualRemindersEnabled}
            trackColor={{ false: '#d1d1d1', true: '#c4b0d9' }}
            thumbColor={spiritualRemindersEnabled ? '#5e3b70' : '#f4f3f4'}
          />
        </View>
      </View>
      
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Privacy & Security</Text>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="shield-checkmark-outline" size={24} color="#5e3b70" style={styles.actionIcon} />
          <Text style={styles.actionText}>Privacy Settings</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="key-outline" size={24} color="#5e3b70" style={styles.actionIcon} />
          <Text style={styles.actionText}>Change Password</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="trash-outline" size={24} color="#5e3b70" style={styles.actionIcon} />
          <Text style={styles.actionText}>Clear Chat History</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Disconnect</Text>
      </TouchableOpacity>
      
      <Text style={styles.versionText}>SoulLink v0.1.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e1e1e1',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#5e3b70',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  profilePhone: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  connectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionLabel: {
    fontSize: 14,
    color: '#888',
    marginRight: 5,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#5e3b70',
  },
  settingsSection: {
    backgroundColor: '#fff',
    marginTop: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 15,
    marginVertical: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 3,
  },
  settingDescription: {
    fontSize: 14,
    color: '#888',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionIcon: {
    marginRight: 15,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    marginTop: 30,
    marginBottom: 10,
    marginHorizontal: 15,
    backgroundColor: '#f8e1e8',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#d04a77',
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    marginBottom: 30,
  },
});

export default ProfileScreen;