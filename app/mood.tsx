import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import GradientBackground from '../components/GradientBackground';
import Card from '../components/Card';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import { colors, spacing, typography, borderRadius } from '../styles/theme';
import { storage, StorageKeys } from '../utils/storage';
import { MoodEntry } from '../utils/types';

const { width } = Dimensions.get('window');

const MOODS = [
  { value: 1, emoji: '😢', label: 'Very Sad', color: colors.error },
  { value: 2, emoji: '😕', label: 'Sad', color: '#F39C12' },
  { value: 3, emoji: '😐', label: 'Neutral', color: colors.mediumGray },
  { value: 4, emoji: '🙂', label: 'Happy', color: '#3498DB' },
  { value: 5, emoji: '😊', label: 'Very Happy', color: colors.success },
];

const MoodScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [note, setNote] = useState('');
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);

  useEffect(() => {
    loadMoodEntries();
  }, []);

  const loadMoodEntries = async () => {
    const saved = await storage.getItem<MoodEntry[]>(StorageKeys.MOOD_ENTRIES);
    if (saved) {
      setMoodEntries(saved);
    }
  };

  const saveMood = async () => {
    if (!selectedMood) return;

    const entry: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood,
      note: note.trim(),
      date: new Date().toISOString(),
    };

    const updated = [entry, ...moodEntries];
    await storage.setItem(StorageKeys.MOOD_ENTRIES, updated);
    setMoodEntries(updated);
    setSelectedMood(null);
    setNote('');
  };

  const getWeeklyMoodData = () => {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);
    const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return daysOfWeek.map((day) => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayEntries = moodEntries.filter((entry) =>
        entry.date.startsWith(dayStr)
      );
      
      if (dayEntries.length === 0) return { day: format(day, 'EEE'), mood: null };
      
      const avgMood = dayEntries.reduce((sum, e) => sum + e.mood, 0) / dayEntries.length;
      return { day: format(day, 'EEE'), mood: Math.round(avgMood) };
    });
  };

  const weeklyData = getWeeklyMoodData();
  const maxMood = 5;

  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <IconButton
            icon="arrow-back"
            onPress={() => router.back()}
            backgroundColor="transparent"
          />
          <Text style={styles.title}>{t('mood.title')}</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Mood Selector */}
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>{t('mood.how_feeling')}</Text>
            <View style={styles.moodGrid}>
              {MOODS.map((mood) => (
                <TouchableOpacity
                  key={mood.value}
                  style={[
                    styles.moodButton,
                    selectedMood === mood.value && styles.moodButtonSelected,
                  ]}
                  onPress={() => setSelectedMood(mood.value as any)}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Note Input */}
          {selectedMood && (
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>{t('mood.add_note')}</Text>
              <TextInput
                style={styles.input}
                placeholder="How are you feeling today?"
                placeholderTextColor={colors.mediumGray}
                value={note}
                onChangeText={setNote}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <Button title={t('mood.save_mood')} onPress={saveMood} style={styles.saveButton} />
            </Card>
          )}

          {/* Weekly Chart */}
          {moodEntries.length > 0 && (
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>{t('mood.this_week')}</Text>
              <View style={styles.chart}>
                {weeklyData.map((data, index) => (
                  <View key={index} style={styles.chartColumn}>
                    <View style={styles.chartBar}>
                      {data.mood && (
                        <View
                          style={[
                            styles.chartFill,
                            {
                              height: `${(data.mood / maxMood) * 100}%`,
                              backgroundColor: MOODS[data.mood - 1].color,
                            },
                          ]}
                        />
                      )}
                    </View>
                    <Text style={styles.chartLabel}>{data.day}</Text>
                  </View>
                ))}
              </View>
            </Card>
          )}

          {/* Recent Entries */}
          {moodEntries.length > 0 && (
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>{t('mood.mood_history')}</Text>
              {moodEntries.slice(0, 7).map((entry) => {
                const moodData = MOODS[entry.mood - 1];
                return (
                  <View key={entry.id} style={styles.entryRow}>
                    <Text style={styles.entryEmoji}>{moodData.emoji}</Text>
                    <View style={styles.entryDetails}>
                      <Text style={styles.entryDate}>
                        {format(new Date(entry.date), 'MMM dd, yyyy')}
                      </Text>
                      {entry.note && <Text style={styles.entryNote}>{entry.note}</Text>}
                    </View>
                  </View>
                );
              })}
            </Card>
          )}

          <View style={{ height: spacing.xxl }} />
        </ScrollView>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.title2,
    color: colors.white,
  },
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.title3,
    color: colors.white,
    marginBottom: spacing.md,
  },
  moodGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodButton: {
    width: (width - spacing.lg * 2 - spacing.lg * 2) / 5 - spacing.xs,
    aspectRatio: 1,
    borderRadius: borderRadius.md,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodButtonSelected: {
    borderColor: colors.pinkHalo,
    backgroundColor: colors.softPurpleGlow + '30',
  },
  moodEmoji: {
    fontSize: 36,
  },
  input: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body1,
    color: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    minHeight: 100,
  },
  saveButton: {
    marginTop: spacing.md,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    paddingVertical: spacing.md,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  chartBar: {
    width: '70%',
    height: 120,
    backgroundColor: colors.darkGray,
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  chartFill: {
    width: '100%',
    borderRadius: 4,
  },
  chartLabel: {
    ...typography.caption,
    color: colors.mediumGray,
    marginTop: spacing.xs,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  entryEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  entryDetails: {
    flex: 1,
  },
  entryDate: {
    ...typography.body2,
    color: colors.white,
    marginBottom: 4,
  },
  entryNote: {
    ...typography.caption,
    color: colors.lightGray,
  },
});

export default MoodScreen;
