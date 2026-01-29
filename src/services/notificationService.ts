import * as Notifications from 'expo-notifications';

const LAST_NOTIFICATION_DATE_KEY = 'last_notification_date';

// Set up notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request notification permissions from user
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

/**
 * Send test notification
 */
export async function sendTestNotification(): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌌 Test Notification',
        body: 'If you see this message, notifications are working!',
        data: { type: 'test' },
      },
      trigger: null, // Show immediately
    });
  } catch (error) {
    console.error('Error sending test notification:', error);
  }
}

/**
 * Vymaž všetky naplánované notifikácie
 */
export async function clearAllNotifications(): Promise<void> {
  try {
    await Notifications.dismissAllNotificationsAsync();
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error clearing notifications:', error);
  }
}
