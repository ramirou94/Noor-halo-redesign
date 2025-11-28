import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import Card from '../components/Card';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import { colors, spacing, typography, borderRadius } from '../styles/theme';
import { storage, StorageKeys } from '../utils/storage';
import { Challenge, UserChallenge } from '../utils/types';
import { usePremium } from '../contexts/PremiumContext';
import challengesData from '../data/challenges.json';

const ChallengesScreen = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { isPremium } = usePremium();
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadUserChallenges();
  }, []);

  const loadUserChallenges = async () => {
    const saved = await storage.getItem<UserChallenge[]>(StorageKeys.CHALLENGES);
    if (saved) {
      setUserChallenges(saved);
    }
  };

  const handleChallengePress = (challenge: Challenge) => {
    // Check if challenge is locked
    if (challenge.isPremium && !isPremium) {
      router.push('/noor-halo-plus');
      return;
    }
    
    setSelectedChallenge(challenge);
    setShowModal(true);
  };

  const startChallenge = async (challengeId: number) => {
    const newUserChallenge: UserChallenge = {
      challengeId,
      startDate: new Date().toISOString(),
      currentDay: 1,
      completed: false,
      completedDays: [],
    };

    const updated = [...userChallenges, newUserChallenge];
    await storage.setItem(StorageKeys.CHALLENGES, updated);
    setUserChallenges(updated);
    setShowModal(false);
  };

  const completeDay = async (challengeId: number, day: number, totalDays: number) => {
    const updated = userChallenges.map((uc) => {
      if (uc.challengeId === challengeId) {
        const completedDays = [...uc.completedDays, day];
        const isCompleted = completedDays.length === totalDays;

        return {
          ...uc,
          completedDays,
          currentDay: Math.min(day + 1, totalDays),
          completed: isCompleted,
        };
      }
      return uc;
    });

    await storage.setItem(StorageKeys.CHALLENGES, updated);
    setUserChallenges(updated);
  };

  const getUserChallenge = (challengeId: number) => {
    return userChallenges.find((uc) => uc.challengeId === challengeId);
  };

  const getChallengeContent = (challenge: Challenge) => {
    const currentLanguage = i18n.language as 'en' | 'fr' | 'ar';
    return challenge[currentLanguage] || challenge.en;
  };

  const isLocked = (challenge: Challenge) => challenge.isPremium && !isPremium;

  const activeChallenges = userChallenges.filter((uc) => !uc.completed);

  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <IconButton
            icon="arrow-back"
            onPress={() => router.back()}
            backgroundColor="transparent"
          />
          <Text style={styles.title}>{t('challenges.title')}</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Active Challenges */}
          {activeChallenges.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>{t('challenges.active')}</Text>
              {activeChallenges.map((uc) => {
                const challenge = (challengesData as Challenge[]).find((c) => c.id === uc.challengeId);
                if (!challenge) return null;
                
                const content = getChallengeContent(challenge);
                const progress = (uc.completedDays.length / challenge.durationDays) * 100;

                return (
                  <TouchableOpacity 
                    key={uc.challengeId}
                    onPress={() => handleChallengePress(challenge)}
                  >
                    <Card style={styles.challengeCard} glow>
                      <Text style={styles.challengeTitle}>{content.title}</Text>
                      <Text style={styles.challengeDescription}>{content.description}</Text>
                      <Text style={styles.durationBadge}>
                        {challenge.durationDays}-day challenge
                      </Text>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            { width: `${progress}%` },
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>
                        {uc.completedDays.length} / {challenge.durationDays} {t('challenges.day')}
                      </Text>
                    </Card>
                  </TouchableOpacity>
                );
              })}
            </>
          )}

          {/* Available Challenges */}
          <Text style={styles.sectionTitle}>Available Challenges</Text>
          {(challengesData as Challenge[]).map((challenge) => {
            const userChallenge = getUserChallenge(challenge.id);
            if (userChallenge && !userChallenge.completed) return null;

            const content = getChallengeContent(challenge);
            const locked = isLocked(challenge);

            return (
              <TouchableOpacity
                key={challenge.id}
                onPress={() => handleChallengePress(challenge)}
              >
                <Card style={styles.challengeCard}>
                  <View style={styles.challengeHeader}>
                    <Ionicons 
                      name={locked ? "lock-closed" : "trophy"} 
                      size={32} 
                      color={locked ? colors.mediumGray : colors.softPurpleGlow} 
                    />
                    <View style={styles.challengeInfo}>
                      <View style={styles.titleRow}>
                        <Text style={styles.challengeTitle}>{content.title}</Text>
                        {locked && (
                          <View style={styles.premiumBadge}>
                            <Text style={styles.premiumText}>{t('premium.locked')}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.durationBadge}>
                        {challenge.durationDays}-day challenge
                      </Text>
                    </View>
                    {userChallenge?.completed && (
                      <Ionicons name="checkmark-circle" size={24} color={colors.pinkHalo} />
                    )}
                  </View>
                  <Text style={styles.challengeDescription} numberOfLines={2}>
                    {content.description}
                  </Text>
                </Card>
              </TouchableOpacity>
            );
          })}

          <View style={{ height: spacing.xxl }} />
        </ScrollView>

        {/* Challenge Detail Modal */}
        <Modal
          visible={showModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedChallenge && (() => {
                const content = getChallengeContent(selectedChallenge);
                const userChallenge = getUserChallenge(selectedChallenge.id);

                return (
                  <>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>{content.title}</Text>
                      <IconButton
                        icon="close"
                        onPress={() => setShowModal(false)}
                        backgroundColor="transparent"
                      />
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                      <Text style={styles.modalDescription}>{content.description}</Text>
                      <Text style={styles.durationBadge}>
                        {selectedChallenge.durationDays}-day challenge
                      </Text>

                      {content.days.map((day) => {
                        const isDayCompleted = userChallenge?.completedDays.includes(day.day);

                        return (
                          <Card key={day.day} style={styles.dayCard}>
                            <View style={styles.dayHeader}>
                              <Text style={styles.dayTitle}>
                                {t('challenges.day')} {day.day} / {selectedChallenge.durationDays}: {day.title}
                              </Text>
                              {isDayCompleted && (
                                <Ionicons name="checkmark-circle" size={24} color={colors.pinkHalo} />
                              )}
                            </View>
                            <Text style={styles.dayTask}>{day.content}</Text>
                            {userChallenge && !isDayCompleted && day.day === userChallenge.currentDay && (
                              <Button
                                title={t('challenges.complete_day')}
                                onPress={() => completeDay(selectedChallenge.id, day.day, selectedChallenge.durationDays)}
                                size="small"
                                style={styles.completeDayButton}
                              />
                            )}
                          </Card>
                        );
                      })}
                    </ScrollView>

                    {!getUserChallenge(selectedChallenge.id) && (
                      <Button
                        title={t('challenges.start_challenge')}
                        onPress={() => startChallenge(selectedChallenge.id)}
                        style={styles.startButton}
                      />
                    )}
                  </>
                );
              })()}
            </View>
          </View>
        </Modal>
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
  sectionTitle: {
    ...typography.title3,
    color: colors.white,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  challengeCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  challengeInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  challengeTitle: {
    ...typography.title3,
    color: colors.white,
    flex: 1,
  },
  premiumBadge: {
    backgroundColor: colors.pinkHalo,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
  premiumText: {
    ...typography.caption,
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  durationBadge: {
    ...typography.caption,
    color: colors.pinkHalo,
    marginTop: 4,
  },
  challengeDescription: {
    ...typography.body2,
    color: colors.lightGray,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.darkGray,
    borderRadius: 4,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.pinkHalo,
  },
  progressText: {
    ...typography.caption,
    color: colors.mediumGray,
    marginTop: spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.deepPurple,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    padding: spacing.lg,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    ...typography.title2,
    color: colors.white,
    flex: 1,
  },
  modalDescription: {
    ...typography.body1,
    color: colors.lightGray,
    marginBottom: spacing.md,
  },
  dayCard: {
    marginBottom: spacing.md,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dayTitle: {
    ...typography.button,
    color: colors.white,
    flex: 1,
  },
  dayTask: {
    ...typography.body2,
    color: colors.lightGray,
  },
  completeDayButton: {
    marginTop: spacing.md,
  },
  startButton: {
    marginTop: spacing.md,
  },
});

export default ChallengesScreen;
