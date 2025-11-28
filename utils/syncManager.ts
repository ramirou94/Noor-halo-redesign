import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { firestore } from './firebaseConfig';
import { storage, StorageKeys } from './storage';
import { Habit, MoodEntry, UserChallenge } from './types';

/**
 * SyncManager - Handles bidirectional sync between AsyncStorage and Firestore
 */
class SyncManager {
  /**
   * Pull all user data from Firestore on login
   */
  async pullAllData(userId: string): Promise<void> {
    if (!firestore) {
      console.warn('Firestore not initialized');
      return;
    }

    try {
      console.log('📥 Pulling data from Firestore for user:', userId);

      // Pull habits
      await this.pullHabits(userId);
      
      // Pull mood entries
      await this.pullMoodEntries(userId);
      
      // Pull challenges
      await this.pullChallenges(userId);
      
      // Pull favorites
      await this.pullFavorites(userId);
      
      // Pull premium status
      await this.pullPremiumStatus(userId);

      console.log('✅ All data pulled from Firestore');
    } catch (error) {
      console.error('Error pulling data from Firestore:', error);
    }
  }

  /**
   * Pull habits from Firestore
   */
  async pullHabits(userId: string): Promise<void> {
    if (!firestore) return;

    try {
      const habitsRef = collection(firestore, 'users', userId, 'habits');
      const snapshot = await getDocs(habitsRef);
      
      if (!snapshot.empty) {
        const habits: Habit[] = [];
        snapshot.forEach((doc) => {
          habits.push(doc.data() as Habit);
        });

        await storage.setItem(StorageKeys.HABITS, habits);
        console.log(`✅ Pulled ${habits.length} habits`);
      }
    } catch (error) {
      console.error('Error pulling habits:', error);
    }
  }

  /**
   * Pull mood entries from Firestore
   */
  async pullMoodEntries(userId: string): Promise<void> {
    if (!firestore) return;

    try {
      const moodsRef = collection(firestore, 'users', userId, 'moodEntries');
      const q = query(moodsRef, orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const moods: MoodEntry[] = [];
        snapshot.forEach((doc) => {
          moods.push(doc.data() as MoodEntry);
        });

        await storage.setItem(StorageKeys.MOOD_ENTRIES, moods);
        console.log(`✅ Pulled ${moods.length} mood entries`);
      }
    } catch (error) {
      console.error('Error pulling mood entries:', error);
    }
  }

  /**
   * Pull challenges from Firestore
   */
  async pullChallenges(userId: string): Promise<void> {
    if (!firestore) return;

    try {
      const challengesRef = collection(firestore, 'users', userId, 'challenges');
      const snapshot = await getDocs(challengesRef);
      
      if (!snapshot.empty) {
        const challenges: UserChallenge[] = [];
        snapshot.forEach((doc) => {
          challenges.push(doc.data() as UserChallenge);
        });

        await storage.setItem(StorageKeys.CHALLENGES, challenges);
        console.log(`✅ Pulled ${challenges.length} challenges`);
      }
    } catch (error) {
      console.error('Error pulling challenges:', error);
    }
  }

  /**
   * Pull ritual favorites from Firestore
   */
  async pullFavorites(userId: string): Promise<void> {
    if (!firestore) return;

    try {
      const userDoc = await getDoc(doc(firestore, 'users', userId));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.ritualFavorites) {
          await storage.setItem(StorageKeys.MY_RITUALS, data.ritualFavorites);
          console.log(`✅ Pulled ${data.ritualFavorites.length} favorite rituals`);
        }
      }
    } catch (error) {
      console.error('Error pulling favorites:', error);
    }
  }

  /**
   * Pull premium status from Firestore
   */
  async pullPremiumStatus(userId: string): Promise<void> {
    if (!firestore) return;

    try {
      const userDoc = await getDoc(doc(firestore, 'users', userId));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (typeof data.isPremium === 'boolean') {
          await storage.setItem('premium_status', data.isPremium);
          console.log(`✅ Pulled premium status: ${data.isPremium}`);
        }
      }
    } catch (error) {
      console.error('Error pulling premium status:', error);
    }
  }

  /**
   * Push habits to Firestore
   */
  async pushHabits(userId: string, habits: Habit[]): Promise<void> {
    if (!firestore) return;

    try {
      const habitsRef = collection(firestore, 'users', userId, 'habits');
      
      // Delete all existing and recreate (simple approach)
      const snapshot = await getDocs(habitsRef);
      for (const habitDoc of snapshot.docs) {
        await deleteDoc(habitDoc.ref);
      }

      // Add all current habits
      for (const habit of habits) {
        await setDoc(doc(habitsRef, habit.id), {
          ...habit,
          updatedAt: serverTimestamp(),
        });
      }

      console.log(`✅ Pushed ${habits.length} habits to Firestore`);
    } catch (error) {
      console.error('Error pushing habits:', error);
    }
  }

  /**
   * Push mood entries to Firestore
   */
  async pushMoodEntries(userId: string, moods: MoodEntry[]): Promise<void> {
    if (!firestore) return;

    try {
      const moodsRef = collection(firestore, 'users', userId, 'moodEntries');
      
      // Only push recent moods (last 100)
      const recentMoods = moods.slice(0, 100);

      for (const mood of recentMoods) {
        await setDoc(doc(moodsRef, mood.id), {
          ...mood,
          updatedAt: serverTimestamp(),
        });
      }

      console.log(`✅ Pushed ${recentMoods.length} mood entries to Firestore`);
    } catch (error) {
      console.error('Error pushing mood entries:', error);
    }
  }

  /**
   * Push challenges to Firestore
   */
  async pushChallenges(userId: string, challenges: UserChallenge[]): Promise<void> {
    if (!firestore) return;

    try {
      const challengesRef = collection(firestore, 'users', userId, 'challenges');
      
      for (const challenge of challenges) {
        await setDoc(doc(challengesRef, challenge.challengeId.toString()), {
          ...challenge,
          updatedAt: serverTimestamp(),
        });
      }

      console.log(`✅ Pushed ${challenges.length} challenges to Firestore`);
    } catch (error) {
      console.error('Error pushing challenges:', error);
    }
  }

  /**
   * Push ritual favorites to Firestore
   */
  async pushFavorites(userId: string, favorites: number[]): Promise<void> {
    if (!firestore) return;

    try {
      await updateDoc(doc(firestore, 'users', userId), {
        ritualFavorites: favorites,
        updatedAt: serverTimestamp(),
      });

      console.log(`✅ Pushed ${favorites.length} favorites to Firestore`);
    } catch (error) {
      console.error('Error pushing favorites:', error);
    }
  }

  /**
   * Push premium status to Firestore
   */
  async pushPremiumStatus(userId: string, isPremium: boolean): Promise<void> {
    if (!firestore) return;

    try {
      await updateDoc(doc(firestore, 'users', userId), {
        isPremium,
        updatedAt: serverTimestamp(),
      });

      console.log(`✅ Pushed premium status: ${isPremium}`);
    } catch (error) {
      console.error('Error pushing premium status:', error);
    }
  }

  /**
   * Sync on login - merge local and remote data
   */
  async syncOnLogin(userId: string): Promise<void> {
    if (!firestore) return;

    try {
      console.log('🔄 Starting sync on login...');

      // Check if user document exists
      const userDoc = await getDoc(doc(firestore, 'users', userId));

      if (!userDoc.exists()) {
        // First time user - push all local data to Firestore
        console.log('📤 First login - uploading local data to Firestore');
        await this.pushAllLocalData(userId);
      } else {
        // Existing user - pull from Firestore (source of truth)
        console.log('📥 Existing user - pulling from Firestore');
        await this.pullAllData(userId);
      }

      console.log('✅ Sync on login complete');
    } catch (error) {
      console.error('Error syncing on login:', error);
    }
  }

  /**
   * Push all local data to Firestore (first login)
   */
  async pushAllLocalData(userId: string): Promise<void> {
    if (!firestore) return;

    try {
      // Get all local data
      const habits = await storage.getItem<Habit[]>(StorageKeys.HABITS) || [];
      const moods = await storage.getItem<MoodEntry[]>(StorageKeys.MOOD_ENTRIES) || [];
      const challenges = await storage.getItem<UserChallenge[]>(StorageKeys.CHALLENGES) || [];
      const favorites = await storage.getItem<number[]>(StorageKeys.MY_RITUALS) || [];
      const isPremium = await storage.getItem<boolean>('premium_status') || false;

      // Push all to Firestore
      if (habits.length > 0) await this.pushHabits(userId, habits);
      if (moods.length > 0) await this.pushMoodEntries(userId, moods);
      if (challenges.length > 0) await this.pushChallenges(userId, challenges);
      if (favorites.length > 0) await this.pushFavorites(userId, favorites);
      await this.pushPremiumStatus(userId, isPremium);

      console.log('✅ All local data pushed to Firestore');
    } catch (error) {
      console.error('Error pushing all local data:', error);
    }
  }

  /**
   * Sync on logout - clear local data
   */
  async syncOnLogout(): Promise<void> {
    try {
      // Clear user-specific data but keep preferences
      await storage.removeItem(StorageKeys.HABITS);
      await storage.removeItem(StorageKeys.MOOD_ENTRIES);
      await storage.removeItem(StorageKeys.CHALLENGES);
      await storage.removeItem(StorageKeys.MY_RITUALS);
      await storage.removeItem('premium_status');

      console.log('✅ Local user data cleared on logout');
    } catch (error) {
      console.error('Error clearing data on logout:', error);
    }
  }

  /**
   * Sync single habit change
   */
  async syncHabitChange(userId: string, habit: Habit): Promise<void> {
    if (!firestore || !userId) return;

    try {
      await setDoc(doc(firestore, 'users', userId, 'habits', habit.id), {
        ...habit,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error syncing habit change:', error);
    }
  }

  /**
   * Sync single mood entry
   */
  async syncMoodEntry(userId: string, mood: MoodEntry): Promise<void> {
    if (!firestore || !userId) return;

    try {
      await setDoc(doc(firestore, 'users', userId, 'moodEntries', mood.id), {
        ...mood,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error syncing mood entry:', error);
    }
  }

  /**
   * Sync challenge progress
   */
  async syncChallengeProgress(userId: string, challenge: UserChallenge): Promise<void> {
    if (!firestore || !userId) return;

    try {
      await setDoc(
        doc(firestore, 'users', userId, 'challenges', challenge.challengeId.toString()),
        {
          ...challenge,
          updatedAt: serverTimestamp(),
        }
      );
    } catch (error) {
      console.error('Error syncing challenge:', error);
    }
  }
}

// Export singleton instance
export const syncManager = new SyncManager();

export default syncManager;
