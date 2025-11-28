import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { CelestialOrb } from '../../components/CelestialOrb';
import Button from '../../components/Button';
import IconButton from '../../components/IconButton';
import { colors, spacing, typography, borderRadius } from '../../styles/theme';
import { storage, StorageKeys } from '../../utils/storage';
import { Habit } from '../../utils/types';
import { format } from 'date-fns';

const { width } = Dimensions.get('window');

const HABIT_ICONS: Array<keyof typeof Ionicons.glyphMap> = [
  'moon', 'sunny', 'water', 'heart', 'leaf', 'flame',
  'book', 'fitness', 'bed', 'cafe', 'walk', 'bicycle',
];

const HabitsScreen = () => {
  const { t } = useTranslation();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    icon: 'moon' as keyof typeof Ionicons.glyphMap,
    frequency: 'daily' as 'daily' | 'weekly' | 'custom',
  });

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    const savedHabits = await storage.getItem<Habit[]>(StorageKeys.HABITS);
    if (savedHabits) {
      setHabits(savedHabits);
    }
  };

  const saveHabits = async (updatedHabits: Habit[]) => {
    await storage.setItem(StorageKeys.HABITS, updatedHabits);
    setHabits(updatedHabits);
  };

  const addHabit = async () => {
    if (!newHabit.name.trim()) {
      Alert.alert(t('common.error'), 'Please enter a habit name');
      return;
    }

    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.name,
      icon: newHabit.icon,
      frequency: newHabit.frequency,
      completedDates: [],
      createdAt: new Date().toISOString(),
      streak: 0,
    };

    const updatedHabits = [...habits, habit];
    await saveHabits(updatedHabits);

    setNewHabit({
      name: '',
      icon: 'moon',
      frequency: 'daily',
    });
    setShowAddModal(false);
  };

  const toggleHabit = async (habitId: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const updatedHabits = habits.map((habit) => {
      if (habit.id === habitId) {
        const isCompleted = habit.completedDates.includes(today);

        if (isCompleted) {
          return {
            ...habit,
            completedDates: habit.completedDates.filter((date) => date !== today),
            streak: Math.max(0, habit.streak - 1),
          };
        } else {
          return {
            ...habit,
            completedDates: [...habit.completedDates, today],
            streak: habit.streak + 1,
          };
        }
      }
      return habit;
    });

    await saveHabits(updatedHabits);
  };

  const deleteHabit = async (habitId: string) => {
    Alert.alert(
      t('common.delete'),
      'Are you sure you want to delete this habit?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            const updatedHabits = habits.filter((h) => h.id !== habitId);
            await saveHabits(updatedHabits);
          },
        },
      ]
    );
  };

  const isCompletedToday = (habit: Habit): boolean => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return habit.completedDates.includes(today);
  };

  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={styles.backgroundContainer}>
        <View style={styles.orbTop}>
          <CelestialOrb size={width * 1.1} variant="aurora" />
        </View>
        <View style={styles.orbBottom}>
          <CelestialOrb size={width * 0.9} variant="starfield" />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('habits.title')}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add-circle" size={32} color={colors.auroraTeal} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {habits.length === 0 ? (
            <BlurView intensity={10} tint="dark" style={styles.emptyCard}>
              <View style={styles.emptyContent}>
                <Ionicons name="leaf" size={48} color={colors.stardust} />
                <Text style={styles.emptyTitle}>{t('habits.no_habits')}</Text>
                <Text style={styles.emptyText}>{t('habits.add_first_habit')}</Text>
              </View>
            </BlurView>
          ) : (
            habits.map((habit) => {
              const isCompleted = isCompletedToday(habit);
              return (
                <BlurView key={habit.id} intensity={10} tint="dark" style={styles.habitCard}>
                  <View style={styles.habitCardContent}>
                    <View style={styles.habitHeader}>
                      <View style={styles.habitInfo}>
                        <View style={[styles.iconContainer, { backgroundColor: isCompleted ? 'rgba(20, 241, 149, 0.2)' : 'rgba(78, 168, 222, 0.2)' }]}>
                          <Ionicons
                            name={habit.icon}
                            size={24}
                            color={isCompleted ? colors.auroraTeal : colors.stellarBlue}
                          />
                        </View>
                        <View style={styles.habitDetails}>
                          <Text style={styles.habitName}>{habit.name}</Text>
                          <Text style={styles.habitFrequency}>
                            {t(`habits.${habit.frequency}`)} • {habit.streak} {t('habits.days')}
                          </Text>
                        </View>
                      </View>
                      <IconButton
                        icon="trash"
                        onPress={() => deleteHabit(habit.id)}
                        size={20}
                        color={colors.error}
                        backgroundColor="transparent"
                      />
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.checkButton,
                        isCompleted && styles.checkButtonCompleted,
                      ]}
                      onPress={() => toggleHabit(habit.id)}
                    >
                      <Ionicons
                        name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
                        size={24}
                        color={isCompleted ? colors.midnight : colors.auroraTeal}
                      />
                      <Text
                        style={[
                          styles.checkButtonText,
                          isCompleted && styles.checkButtonTextCompleted,
                        ]}
                      >
                        {isCompleted ? t('habits.completed_today') : t('habits.mark_done')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </BlurView>
              );
            })
          )}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Add Habit Modal */}
        <Modal
          visible={showAddModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowAddModal(false)}
        >
          <View style={styles.modalOverlay}>
            <BlurView intensity={80} tint="dark" style={styles.modalBlur}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{t('habits.add_habit')}</Text>
                  <IconButton
                    icon="close"
                    onPress={() => setShowAddModal(false)}
                    size={24}
                    color={colors.moonstone}
                    backgroundColor="transparent"
                  />
                </View>

                <TextInput
                  style={styles.input}
                  placeholder={t('habits.habit_name')}
                  placeholderTextColor={colors.stardust}
                  value={newHabit.name}
                  onChangeText={(text) => setNewHabit({ ...newHabit, name: text })}
                />

                <Text style={styles.label}>Icon</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconScroll}>
                  {HABIT_ICONS.map((icon) => (
                    <TouchableOpacity
                      key={icon}
                      style={[
                        styles.iconOption,
                        newHabit.icon === icon && styles.iconOptionSelected,
                      ]}
                      onPress={() => setNewHabit({ ...newHabit, icon })}
                    >
                      <Ionicons
                        name={icon}
                        size={28}
                        color={newHabit.icon === icon ? colors.midnight : colors.stardust}
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Text style={styles.label}>{t('habits.frequency')}</Text>
                <View style={styles.frequencyContainer}>
                  {(['daily', 'weekly', 'custom'] as const).map((freq) => (
                    <TouchableOpacity
                      key={freq}
                      style={[
                        styles.frequencyButton,
                        newHabit.frequency === freq && styles.frequencyButtonSelected,
                      ]}
                      onPress={() => setNewHabit({ ...newHabit, frequency: freq })}
                    >
                      <Text
                        style={[
                          styles.frequencyText,
                          newHabit.frequency === freq && styles.frequencyTextSelected,
                        ]}
                      >
                        {t(`habits.${freq}`)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Button title={t('common.add')} onPress={addHabit} style={styles.addHabitButton} />
              </View>
            </BlurView>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.midnight,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  orbTop: {
    position: 'absolute',
    top: -100,
    left: -150,
    opacity: 0.6,
  },
  orbBottom: {
    position: 'absolute',
    bottom: -150,
    right: -100,
    opacity: 0.5,
  },
  content: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.title2,
    color: colors.moonstone,
  },
  addButton: {
    padding: spacing.xs,
  },
  emptyCard: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    backgroundColor: 'rgba(10, 14, 39, 0.3)',
  },
  emptyTitle: {
    ...typography.title3,
    color: colors.moonstone,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.body2,
    color: colors.stardust,
    textAlign: 'center',
  },
  habitCard: {
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  habitCardContent: {
    padding: spacing.md,
    backgroundColor: 'rgba(10, 14, 39, 0.3)',
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  habitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitDetails: {
    marginLeft: spacing.md,
    flex: 1,
  },
  habitName: {
    ...typography.title3,
    color: colors.moonstone,
    marginBottom: 4,
  },
  habitFrequency: {
    ...typography.caption,
    color: colors.stardust,
  },
  checkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.auroraTeal,
    backgroundColor: 'rgba(20, 241, 149, 0.05)',
  },
  checkButtonCompleted: {
    backgroundColor: colors.auroraTeal,
    borderColor: colors.auroraTeal,
  },
  checkButtonText: {
    ...typography.button,
    color: colors.auroraTeal,
    marginLeft: spacing.sm,
  },
  checkButtonTextCompleted: {
    color: colors.midnight,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBlur: {
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  modalContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    backgroundColor: 'rgba(10, 14, 39, 0.5)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    ...typography.title2,
    color: colors.moonstone,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body1,
    color: colors.moonstone,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.body1,
    color: colors.moonstone,
    marginBottom: spacing.sm,
  },
  iconScroll: {
    marginBottom: spacing.lg,
  },
  iconOption: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconOptionSelected: {
    borderColor: colors.auroraTeal,
    backgroundColor: colors.auroraTeal,
  },
  frequencyContainer: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  frequencyButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  frequencyButtonSelected: {
    borderColor: colors.auroraTeal,
    backgroundColor: 'rgba(20, 241, 149, 0.1)',
  },
  frequencyText: {
    ...typography.button,
    color: colors.stardust,
  },
  frequencyTextSelected: {
    color: colors.auroraTeal,
  },
  addHabitButton: {
    marginTop: spacing.md,
  },
});

export default HabitsScreen;
