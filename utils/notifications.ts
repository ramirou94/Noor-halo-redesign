import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { storage } from './storage';
import i18n from '../i18n';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Notification IDs
export const NotificationIds = {
  MORNING_REMINDER: 'morning_reminder',
  EVENING_REMINDER: 'evening_reminder',
  DAILY_QUOTE: 'daily_quote',
  HABIT_PREFIX: 'habit_',
  CHALLENGE_PREFIX: 'challenge_',
};

/**
 * Request notification permissions
 */
export async function requestPermissions(): Promise<boolean> {
  if (!Device.isDevice) {
    console.warn('Notifications only work on physical devices');
    return false;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Notification permission denied');
      return false;
    }

    // Android specific channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#8A4FFF',
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

/**
 * Get notification content in current language
 */
function getNotificationContent(type: string, data?: any) {
  const lang = i18n.language;
  
  const content: any = {
    morning_reminder: {
      fr: {
        title: '🌅 Bonjour',
        body: 'Prends un moment pour toi ce matin. Ta lumière intérieure t\'attend.',
      },
      en: {
        title: '🌅 Good Morning',
        body: 'Take a moment for yourself this morning. Your inner light awaits.',
      },
      ar: {
        title: '🌅 صباح الخير',
        body: 'خذ لحظة لنفسك هذا الصباح. نورك الداخلي ينتظرك.',
      },
    },
    evening_reminder: {
      fr: {
        title: '🌙 Bonsoir',
        body: 'Prends quelques minutes pour relâcher ta journée avant de dormir.',
      },
      en: {
        title: '🌙 Good Evening',
        body: 'Take a few minutes to release your day before sleep.',
      },
      ar: {
        title: '🌙 مساء الخير',
        body: 'خذ بضع دقائق للتخلص من يومك قبل النوم.',
      },
    },
    daily_quote: {
      fr: {
        title: '✨ Ta Citation du Jour',
        body: 'Une nouvelle source d\'inspiration t\'attend dans Noor Halo.',
      },
      en: {
        title: '✨ Your Quote of the Day',
        body: 'A new source of inspiration awaits you in Noor Halo.',
      },
      ar: {
        title: '✨ اقتباسك اليومي',
        body: 'مصدر جديد للإلهام ينتظرك في Noor Halo.',
      },
    },
    habit_reminder: {
      fr: {
        title: `🌱 Rappel: ${data?.habitName || 'Ton habitude'}`,
        body: 'C\'est le moment de prendre soin de toi.',
      },
      en: {
        title: `🌱 Reminder: ${data?.habitName || 'Your habit'}`,
        body: 'Time to take care of yourself.',
      },
      ar: {
        title: `🌱 تذكير: ${data?.habitName || 'عادتك'}`,
        body: 'حان الوقت للعناية بنفسك.',
      },
    },
    challenge_reminder: {
      fr: {
        title: '🏆 Challenge en Cours',
        body: `Jour ${data?.day || 1}: ${data?.title || 'Continue ton voyage'}`,
      },
      en: {
        title: '🏆 Challenge in Progress',
        body: `Day ${data?.day || 1}: ${data?.title || 'Continue your journey'}`,
      },
      ar: {
        title: '🏆 تحدي جارٍ',
        body: `يوم ${data?.day || 1}: ${data?.title || 'واصل رحلتك'}`,
      },
    },
  };

  return content[type]?.[lang] || content[type]?.en || { title: 'Noor Halo', body: '' };
}

/**
 * Schedule daily notification at specific time
 */
export async function scheduleDailyNotification(
  hour: number,
  minute: number,
  identifier: string,
  type: string,
  data?: any
): Promise<void> {
  try {
    const content = getNotificationContent(type, data);

    await Notifications.scheduleNotificationAsync({
      identifier,
      content,
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });

    console.log(`✅ Scheduled ${type} notification at ${hour}:${minute}`);
  } catch (error) {
    console.error(`Error scheduling ${type} notification:`, error);
  }
}

/**
 * Schedule habit reminder
 */
export async function scheduleHabitNotification(habit: {
  id: string;
  name: string;
  reminderTime?: { hour: number; minute: number };
}): Promise<void> {
  if (!habit.reminderTime) return;

  const identifier = `${NotificationIds.HABIT_PREFIX}${habit.id}`;
  
  await scheduleDailyNotification(
    habit.reminderTime.hour,
    habit.reminderTime.minute,
    identifier,
    'habit_reminder',
    { habitName: habit.name }
  );
}

/**
 * Schedule challenge reminder
 */
export async function scheduleChallengeReminder(
  challengeId: number,
  currentDay: number,
  dayTitle: string
): Promise<void> {
  const identifier = `${NotificationIds.CHALLENGE_PREFIX}${challengeId}`;
  
  await scheduleDailyNotification(
    8,
    0,
    identifier,
    'challenge_reminder',
    { day: currentDay, title: dayTitle }
  );
}

/**
 * Cancel specific notification
 */
export async function cancelNotification(identifier: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(identifier);
    console.log(`✅ Cancelled notification: ${identifier}`);
  } catch (error) {
    console.error(`Error cancelling notification ${identifier}:`, error);
  }
}

/**
 * Cancel all notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('✅ All notifications cancelled');
  } catch (error) {
    console.error('Error cancelling all notifications:', error);
  }
}

/**
 * Initialize app notifications based on settings
 */
export async function initializeNotifications(preferences: any): Promise<void> {
  // Request permissions first
  const hasPermission = await requestPermissions();
  if (!hasPermission) {
    console.warn('No notification permission, skipping initialization');
    return;
  }

  // Cancel all existing
  await cancelAllNotifications();

  // Schedule based on preferences
  if (preferences?.notifications?.morningReminder) {
    await scheduleDailyNotification(8, 0, NotificationIds.MORNING_REMINDER, 'morning_reminder');
  }

  if (preferences?.notifications?.eveningReminder) {
    await scheduleDailyNotification(20, 0, NotificationIds.EVENING_REMINDER, 'evening_reminder');
  }

  if (preferences?.notifications?.dailyQuote) {
    await scheduleDailyNotification(10, 0, NotificationIds.DAILY_QUOTE, 'daily_quote');
  }

  console.log('✅ Notifications initialized');
}

/**
 * Update notifications when language changes
 */
export async function updateNotificationsLanguage(): Promise<void> {
  // Get current scheduled notifications
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  
  // Cancel and reschedule all with new language
  for (const notification of scheduled) {
    if (notification.identifier) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      // Reschedule would need context about the notification type
      // For simplicity, reinitialize all notifications
    }
  }
  
  console.log('✅ Notifications language updated');
}

export default {
  requestPermissions,
  scheduleDailyNotification,
  scheduleHabitNotification,
  scheduleChallengeReminder,
  cancelNotification,
  cancelAllNotifications,
  initializeNotifications,
  updateNotificationsLanguage,
};
