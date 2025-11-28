import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  ONBOARDING_COMPLETED: '@noor_halo:onboarding_completed',
  HABITS: '@noor_halo:habits',
  MY_RITUALS: '@noor_halo:my_rituals',
  MOOD_ENTRIES: '@noor_halo:mood_entries',
  CHALLENGES: '@noor_halo:challenges',
  PREFERENCES: '@noor_halo:preferences',
  QUOTE_INDEX: '@noor_halo:quote_index',
};

export const storage = {
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};

export default storage;