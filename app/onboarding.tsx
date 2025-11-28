import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ViewToken,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import HaloGlow from '../components/HaloGlow';
import Button from '../components/Button';
import { colors, spacing, typography } from '../styles/theme';
import { storage, StorageKeys } from '../utils/storage';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  titleKey: string;
  descriptionKey: string;
}

const OnboardingScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides: OnboardingSlide[] = [
    {
      id: '1',
      icon: 'moon',
      titleKey: 'onboarding.slide1_title',
      descriptionKey: 'onboarding.slide1_description',
    },
    {
      id: '2',
      icon: 'heart',
      titleKey: 'onboarding.slide2_title',
      descriptionKey: 'onboarding.slide2_description',
    },
    {
      id: '3',
      icon: 'sparkles',
      titleKey: 'onboarding.slide3_title',
      descriptionKey: 'onboarding.slide3_description',
    },
  ];

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index || 0);
      }
    }
  ).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = async () => {
    await storage.setItem(StorageKeys.ONBOARDING_COMPLETED, true);
    router.replace('/(tabs)');
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={styles.slide}>
      <View style={styles.iconContainer}>
        <HaloGlow size={300} intensity="high" />
        <Ionicons
          name={item.icon}
          size={100}
          color={colors.pinkHalo}
          style={styles.icon}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{t(item.titleKey)}</Text>
        <Text style={styles.description}>{t(item.descriptionKey)}</Text>
      </View>
    </View>
  );

  return (
    <GradientBackground>
      <View style={styles.container}>
        {currentIndex < slides.length - 1 && (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>{t('common.skip')}</Text>
          </TouchableOpacity>
        )}

        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={renderSlide}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        />

        <View style={styles.footer}>
          <View style={styles.pagination}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentIndex && styles.activeDot,
                ]}
              />
            ))}
          </View>

          <Button
            title={
              currentIndex === slides.length - 1
                ? t('onboarding.get_started')
                : t('common.next')
            }
            onPress={handleNext}
            style={styles.button}
          />
        </View>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: spacing.lg,
    zIndex: 10,
    padding: spacing.sm,
  },
  skipText: {
    ...typography.body1,
    color: colors.lightGray,
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  icon: {
    position: 'absolute',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    ...typography.title2,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body1,
    color: colors.lightGray,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.mediumGray,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: colors.pinkHalo,
  },
  button: {
    width: '100%',
  },
});

export default OnboardingScreen;
