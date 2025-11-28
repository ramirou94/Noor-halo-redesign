import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Share,
  ViewToken,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import GradientBackground from '../components/GradientBackground';
import Card from '../components/Card';
import HaloGlow from '../components/HaloGlow';
import IconButton from '../components/IconButton';
import { colors, spacing, typography } from '../styles/theme';
import { storage, StorageKeys } from '../utils/storage';
import quotesData from '../data/quotes.json';
import { Quote } from '../utils/types';

const { width } = Dimensions.get('window');

const QuotesScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quotes] = useState<Quote[]>(quotesData as Quote[]);
  const flatListRef = useRef<any>(null);

  useEffect(() => {
    loadQuoteIndex();
  }, []);

  const loadQuoteIndex = async () => {
    const savedIndex = await storage.getItem<number>(StorageKeys.QUOTE_INDEX);
    if (savedIndex !== null && savedIndex < quotes.length) {
      setCurrentIndex(savedIndex);
    }
  };

  const saveQuoteIndex = async (index: number) => {
    await storage.setItem(StorageKeys.QUOTE_INDEX, index);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % quotes.length;
    setCurrentIndex(nextIndex);
    saveQuoteIndex(nextIndex);
  };

  const handlePrevious = () => {
    const prevIndex = currentIndex === 0 ? quotes.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    saveQuoteIndex(prevIndex);
  };

  const handleShare = async () => {
    const quote = quotes[currentIndex];
    const currentLanguage = i18n.language as 'en' | 'fr' | 'ar';
    const quoteText = quote[currentLanguage] || quote.en;
    try {
      await Share.share({
        message: `"${quoteText}"\n\n— Noor Halo\n\nShared from Noor Halo`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const currentQuote = quotes[currentIndex];
  const currentLanguage = i18n.language as 'en' | 'fr' | 'ar';
  const quoteText = currentQuote[currentLanguage] || currentQuote.en;

  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <IconButton
            icon="arrow-back"
            onPress={() => router.back()}
            backgroundColor="transparent"
          />
          <Text style={styles.title}>{t('quotes.title')}</Text>
          <IconButton
            icon="share-social"
            onPress={handleShare}
            backgroundColor="transparent"
          />
        </View>

        <View style={styles.content}>
          <View style={styles.haloContainer}>
            <HaloGlow size={200} intensity="high" />
          </View>

          <Animated.View
            key={currentIndex}
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(200)}
          >
            <Card style={styles.quoteCard} glow>
              <Ionicons
                name="sparkles"
                size={32}
                color={colors.pinkHalo}
                style={styles.icon}
              />
              <Text style={styles.quoteText}>"{quoteText}"</Text>
              <Text style={styles.quoteAuthor}>— Noor Halo</Text>
              <Text style={styles.quoteNumber}>
                {currentIndex + 1} / {quotes.length}
              </Text>
            </Card>
          </Animated.View>

          <View style={styles.navigation}>
            <TouchableOpacity onPress={handlePrevious} style={styles.navButton}>
              <Ionicons name="chevron-back" size={32} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNext} style={styles.navButton}>
              <Ionicons name="chevron-forward" size={32} color={colors.white} />
            </TouchableOpacity>
          </View>

          <Text style={styles.hint}>{t('quotes.swipe_more')}</Text>
        </View>
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
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.title2,
    color: colors.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  haloContainer: {
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  quoteCard: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  icon: {
    marginBottom: spacing.lg,
  },
  quoteText: {
    ...typography.title3,
    color: colors.white,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: spacing.lg,
    lineHeight: 32,
  },
  quoteAuthor: {
    ...typography.body1,
    color: colors.pinkHalo,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  quoteNumber: {
    ...typography.caption,
    color: colors.mediumGray,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
    gap: spacing.xxl,
  },
  navButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.softPurpleGlow,
  },
  hint: {
    ...typography.caption,
    color: colors.mediumGray,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});

export default QuotesScreen;