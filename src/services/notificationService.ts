import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';

const NOTIFICATION_TASK_NAME = 'APOD_DAILY_NOTIFICATION';
const LAST_NOTIFICATION_DATE_KEY = 'last_notification_date';

// Nastavenie obsluhy notifikácií
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Registruj background task na denné notifikácie
 */
export async function registerDailyNotificationTask(): Promise<void> {
  try {
    // Skontroluj či je task už registrovaný
    const isTaskDefined = TaskManager.isTaskDefined(NOTIFICATION_TASK_NAME);
    
    if (!isTaskDefined) {
      TaskManager.defineTask(NOTIFICATION_TASK_NAME, async () => {
        try {
          const today = new Date().toISOString().split('T')[0];
          const lastNotificationDate = await AsyncStorage.getItem(
            LAST_NOTIFICATION_DATE_KEY
          );

          
          if (lastNotificationDate !== today) {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: '🌌 NASA APOD',
                body: 'Nová fotka Vesmíru dňa je tu!',
                data: { type: 'apod' },
              },
              trigger: null, // Hneď sa zobrazí
            });

            await AsyncStorage.setItem(LAST_NOTIFICATION_DATE_KEY, today);
          }
        } catch (error) {
          console.error('Error in notification task:', error);
        }
      });
    }

    // Zaregistruj úlohu, aby sa spustila každý deň o 9:00 ráno
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌌 NASA APOD',
        body: 'Nová fotka Vesmíru dňa!',
        data: { type: 'apod' },
      },
      trigger: {
        type: 'daily',
        hour: 9,
        minute: 0,
      },
    });
  } catch (error) {
    console.error('Error registering notification task:', error);
  }
}

/**
 * Požiada o povolenia pre notifikácie
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
 * Odeši testovaciu notifikáciu
 */
export async function sendTestNotification(): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌌 Test Notifikácia',
        body: 'Ak vidíš túto správu, notifikácie fungujú!',
        data: { type: 'test' },
      },
      trigger: { seconds: 2 }, // Za 2 sekundy
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
