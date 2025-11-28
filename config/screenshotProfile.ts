// Screenshot profile configuration
// Used for generating clean demo data for App Store/Play Store screenshots

export const screenshotProfile = {
  enabled: process.env.DEMO_MODE === 'true' || false,
  demoUserEmail: 'screenshots@noorhalo.app',
  language: 'fr', // Can be changed to 'en' or 'ar' for localized screenshots
  
  demoHabits: [
    {
      id: 'demo_habit_1',
      name: 'Respiration 3 minutes',
      icon: 'cloud',
      frequency: 'daily' as const,
      completedDates: [
        new Date().toISOString().split('T')[0],
        new Date(Date.now() - 86400000).toISOString().split('T')[0],
        new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
      ],
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      streak: 3,
    },
    {
      id: 'demo_habit_2',
      name: 'Check-in du soir',
      icon: 'moon',
      frequency: 'daily' as const,
      completedDates: [
        new Date().toISOString().split('T')[0],
      ],
      createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
      streak: 1,
    },
    {
      id: 'demo_habit_3',
      name: 'Gratitude douce',
      icon: 'heart',
      frequency: 'daily' as const,
      completedDates: [
        new Date().toISOString().split('T')[0],
        new Date(Date.now() - 86400000).toISOString().split('T')[0],
        new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
        new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
        new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
      ],
      createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
      streak: 5,
    },
    {
      id: 'demo_habit_4',
      name: 'Méditation courte',
      icon: 'sunny',
      frequency: 'daily' as const,
      completedDates: [
        new Date().toISOString().split('T')[0],
        new Date(Date.now() - 86400000).toISOString().split('T')[0],
      ],
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      streak: 2,
    },
  ],

  demoChallenges: [
    {
      challengeId: 1, // 7 Days of Inner Calm
      startDate: new Date(Date.now() - 86400000 * 3).toISOString(),
      currentDay: 4,
      completed: false,
      completedDays: [1, 2, 3],
    },
  ],

  demoMoods: [
    {
      id: 'demo_mood_1',
      mood: 4,
      note: 'Journée calme et productive',
      date: new Date().toISOString(),
    },
    {
      id: 'demo_mood_2',
      mood: 5,
      note: '',
      date: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'demo_mood_3',
      mood: 3,
      note: '',
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'demo_mood_4',
      mood: 4,
      note: 'Belle matinée, méditation efficace',
      date: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 'demo_mood_5',
      mood: 5,
      note: '',
      date: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
    {
      id: 'demo_mood_6',
      mood: 4,
      note: '',
      date: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
  ],

  demoRitualFavorites: [1, 3, 5, 8], // Favorite ritual IDs
};

export default screenshotProfile;