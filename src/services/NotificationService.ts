import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export class NotificationService {
  // Initialize notifications
  static async initialize(): Promise<boolean> {
    try {
      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Notification permission not granted');
        return false;
      }
      
      // Configure notifications
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });
      
      // Get push token
      const token = await this.registerForPushNotifications();
      
      return token !== null;
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return false;
    }
  }

  // Register for push notifications
  private static async registerForPushNotifications(): Promise<string | null> {
    try {
      // Check if device is a physical device
      // const deviceType = await Device.getDeviceTypeAsync();
      // if (deviceType !== Device.DeviceType.PHONE) {
      //   console.log('Must use physical device for push notifications');
      //   return null;
      // }
      
      // Get push token
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-project-id', // Replace with your actual project ID
      });
      
      // Configure for Android
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
      
      return token.data;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  }

  // Send local notification
  static async sendLocalNotification(
    title: string,
    body: string,
    data?: Record<string, unknown>
  ): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
          sound: true,
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  }

  // Send partner online notification
  static async sendPartnerOnlineNotification(partnerName: string): Promise<void> {
    await this.sendLocalNotification(
      'Soul Connection',
      `${partnerName} is online and may be thinking of you – why not say hi?`,
      { type: 'partner_online' }
    );
  }

  // Send new message notification
  static async sendNewMessageNotification(
    partnerName: string,
    message: string
  ): Promise<void> {
    await this.sendLocalNotification(
      partnerName,
      message,
      { type: 'new_message' }
    );
  }

  // Send spiritual reminder
  static async sendSpiritualReminder(): Promise<void> {
    const reminders = [
      'Take a moment to connect with your partner's energy today',
      'Remember to express gratitude for your soul connection',
      'A moment of mindfulness can strengthen your bond',
      'Your love transcends physical distance',
      'Send a loving thought to your partner right now'
    ];
    
    const randomIndex = Math.floor(Math.random() * reminders.length);
    
    await this.sendLocalNotification(
      'Soul Reminder',
      reminders[randomIndex],
      { type: 'spiritual_reminder' }
    );
  }

  // Add notification listener
  static addNotificationListener(
    listener: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(listener);
  }

  // Add notification response listener
  static addNotificationResponseListener(
    listener: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  // Remove notification listener
  static removeNotificationListener(subscription: Notifications.Subscription): void {
    Notifications.removeNotificationSubscription(subscription);
  }
}