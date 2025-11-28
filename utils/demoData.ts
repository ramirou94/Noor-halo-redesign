import { storage, StorageKeys } from './storage';
import { screenshotProfile } from '../config/screenshotProfile';
import { Habit, MoodEntry, UserChallenge } from './types';

/**
 * Seed demo data for clean screenshots
 * Only runs in development mode when DEMO_MODE is enabled
 */
export async function seedDemoDataIfNeeded(): Promise<void> {
  // Only in dev mode with DEMO_MODE flag
  if (!__DEV__ || !screenshotProfile.enabled) {
    return;
  }

  try {
    console.log('🎬 Seeding demo data for screenshots...');

    // Check if already seeded
    const alreadySeeded = await storage.getItem<boolean>('demo_data_seeded');
    if (alreadySeeded) {
      console.log('✅ Demo data already seeded');
      return;
    }

    // Seed habits
    await storage.setItem(StorageKeys.HABITS, screenshotProfile.demoHabits);
    console.log('✅ Seeded demo habits');

    // Seed challenges
    await storage.setItem(StorageKeys.CHALLENGES, screenshotProfile.demoChallenges);
    console.log('✅ Seeded demo challenges');

    // Seed mood entries
    await storage.setItem(StorageKeys.MOOD_ENTRIES, screenshotProfile.demoMoods);
    console.log('✅ Seeded demo moods');

    // Seed ritual favorites
    await storage.setItem(StorageKeys.MY_RITUALS, screenshotProfile.demoRitualFavorites);
    console.log('✅ Seeded demo ritual favorites');

    // Mark as seeded
    await storage.setItem('demo_data_seeded', true);

    console.log('🎉 Demo data seeding complete!');
  } catch (error) {
    console.error('Error seeding demo data:', error);
  }
}

/**
 * Clear demo data
 */
export async function clearDemoData(): Promise<void> {
  try {
    await storage.removeItem(StorageKeys.HABITS);
    await storage.removeItem(StorageKeys.CHALLENGES);
    await storage.removeItem(StorageKeys.MOOD_ENTRIES);
    await storage.removeItem(StorageKeys.MY_RITUALS);
    await storage.removeItem('demo_data_seeded');
    console.log('✅ Demo data cleared');
  } catch (error) {
    console.error('Error clearing demo data:', error);
  }
}

export default {
  seedDemoDataIfNeeded,
  clearDemoData,
};