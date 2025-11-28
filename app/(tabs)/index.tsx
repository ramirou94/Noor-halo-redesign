import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { CelestialOrb } from '../../components/CelestialOrb';
import Card from '../../components/Card';
import { colors, spacing, typography, borderRadius } from '../../styles/theme';
import ritualsData from '../../data/rituals.json';
import quotesData from '../../data/quotes.json';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  // Get random ritual and quote for the day
  const dailyRitual = ritualsData[Math.floor(Math.random() * ritualsData.length)] as any;
  const dailyQuote = quotesData[Math.floor(Math.random() * quotesData.length)];

  // Get content in current language
  const currentLanguage = i18n.language as 'en' | 'fr' | 'ar';
  const ritualContent = dailyRitual[currentLanguage] || dailyRitual.en;
  const quoteText = dailyQuote[currentLanguage] || dailyQuote.en;

  return (
    <View style={styles.container}>
      {/* Background Elements */}
      <View style={styles.backgroundContainer}>
        <View style={styles.orbTop}>
          <CelestialOrb size={width * 1.2} variant="aurora" />
        </View>
        <View style={styles.orbBottom}>
          <CelestialOrb size={width * 0.8} variant="moonlight" />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeLabel}>{t('common.welcome_back')}</Text>
          <Text style={styles.appName}>Noor Halo</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString(currentLanguage, { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
        </View>

        {/* Daily Ritual Hero Card */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push('/(tabs)/rituals')}
        >
          <BlurView intensity={20} tint="dark" style={styles.heroCard}>
            <View style={styles.heroContent}>
              <View style={styles.heroHeader}>
                <View style={styles.tagContainer}>
                  <Ionicons name="sparkles" size={12} color={colors.midnight} />
                  <Text style={styles.tagText}>{t('home.ritual_of_day')}</Text>
                </View>
                <Ionicons name="arrow-forward-circle" size={32} color={colors.auroraTeal} />
              </View>

              <Text style={styles.heroTitle}>{ritualContent.title}</Text>
              <Text style={styles.heroDescription} numberOfLines={3}>
                {ritualContent.description}
              </Text>
            </View>
          </BlurView>
        </TouchableOpacity>

        {/* Quick Actions Grid */}
        <Text style={styles.sectionTitle}>{t('home.explore')}</Text>

        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => router.push('/(tabs)/audio')}
          >
            <BlurView intensity={10} tint="dark" style={styles.gridCard}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(78, 168, 222, 0.2)' }]}>
                <Ionicons name="musical-notes" size={24} color={colors.stellarBlue} />
              </View>
              <Text style={styles.gridTitle}>{t('home.guided_audio')}</Text>
            </BlurView>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => router.push('/quotes')}
          >
            <BlurView intensity={10} tint="dark" style={styles.gridCard}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(157, 78, 221, 0.2)' }]}>
                <Ionicons name="chatbox-ellipses" size={24} color={colors.auroraViolet} />
              </View>
              <Text style={styles.gridTitle}>{t('home.daily_quote')}</Text>
            </BlurView>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => router.push('/(tabs)/habits')}
          >
            <BlurView intensity={10} tint="dark" style={styles.gridCard}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(20, 241, 149, 0.2)' }]}>
                <Ionicons name="checkmark-circle" size={24} color={colors.auroraTeal} />
              </View>
              <Text style={styles.gridTitle}>{t('home.my_habits')}</Text>
            </BlurView>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => router.push('/challenges')}
          >
            <BlurView intensity={10} tint="dark" style={styles.gridCard}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(241, 188, 94, 0.2)' }]}>
                <Ionicons name="trophy" size={24} color={colors.cosmicGold} />
              </View>
              <Text style={styles.gridTitle}>{t('home.current_challenge')}</Text>
            </BlurView>
          </TouchableOpacity>
        </View>

        {/* Quote of the Day */}
        <View style={styles.quoteContainer}>
          <Ionicons name="quote" size={40} color={colors.auroraViolet} style={styles.quoteIcon} />
          <Text style={styles.quoteText}>"{quoteText}"</Text>
          <View style={styles.separator} />
          <Text style={styles.quoteAuthor}>Noor Halo</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
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
    left: -100,
    opacity: 0.8,
  },
  orbBottom: {
    position: 'absolute',
    bottom: -50,
    right: -50,
    opacity: 0.6,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  welcomeLabel: {
    ...typography.caption,
    color: colors.auroraTeal,
    marginBottom: spacing.xs,
  },
  appName: {
    ...typography.hero,
    fontSize: 42,
    color: colors.moonstone,
    marginBottom: spacing.xs,
  },
  date: {
    ...typography.body2,
    color: colors.stardust,
    textTransform: 'capitalize',
  },
  heroCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: spacing.xl,
  },
  heroContent: {
    padding: spacing.lg,
    backgroundColor: 'rgba(10, 14, 39, 0.4)',
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.auroraTeal,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  tagText: {
    ...typography.caption,
    color: colors.midnight,
    fontSize: 10,
    fontWeight: '700',
  },
  heroTitle: {
    ...typography.title2,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  heroDescription: {
    ...typography.body2,
    color: colors.stardust,
    lineHeight: 22,
  },
  sectionTitle: {
    ...typography.title3,
    color: colors.moonstone,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  gridItem: {
    width: (width - spacing.lg * 2 - spacing.md) / 2,
  },
  gridCard: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'flex-start',
    height: 110,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  gridTitle: {
    ...typography.body2,
    fontWeight: '600',
    color: colors.moonstone,
  },
  quoteContainer: {
    alignItems: 'center',
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  quoteIcon: {
    marginBottom: spacing.md,
    opacity: 0.5,
  },
  quoteText: {
    ...typography.accent,
    fontSize: 24,
    lineHeight: 34,
    textAlign: 'center',
    color: colors.moonstone,
    marginBottom: spacing.lg,
  },
  separator: {
    width: 40,
    height: 2,
    backgroundColor: colors.auroraViolet,
    marginBottom: spacing.md,
    opacity: 0.5,
  },
  quoteAuthor: {
    ...typography.caption,
    color: colors.stardust,
    letterSpacing: 2,
  },
});

export default HomeScreen;