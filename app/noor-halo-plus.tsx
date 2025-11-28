import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import Card from '../components/Card';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import HaloGlow from '../components/HaloGlow';
import { colors, spacing, typography, borderRadius } from '../styles/theme';
import { usePremium } from '../contexts/PremiumContext';

const NoorHaloPlusScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { isPremium, purchaseMonthly, purchaseYearly, restorePurchases } = usePremium();

  const features = [
    {
      icon: 'trophy' as const,
      titleKey: 'premium.feature_challenges',
      descriptionKey: 'premium.feature_challenges_desc',
    },
    {
      icon: 'musical-notes' as const,
      titleKey: 'premium.feature_audio',
      descriptionKey: 'premium.feature_audio_desc',
    },
    {
      icon: 'heart' as const,
      titleKey: 'premium.feature_depth',
      descriptionKey: 'premium.feature_depth_desc',
    },
    {
      icon: 'shield-checkmark' as const,
      titleKey: 'premium.feature_no_ads',
      descriptionKey: 'premium.feature_no_ads_desc',
    },
  ];

  if (isPremium) {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <View style={styles.header}>
            <IconButton
              icon="arrow-back"
              onPress={() => router.back()}
              backgroundColor="transparent"
            />
          </View>

          <View style={styles.premiumActive}>
            <HaloGlow size={200} intensity="high" />
            <Ionicons name="checkmark-circle" size={80} color={colors.pinkHalo} style={styles.checkIcon} />
            <Text style={styles.activeTitle}>{t('premium.already_premium')}</Text>
            <Text style={styles.activeSubtitle}>{t('premium.thank_you')}</Text>
            
            <Button
              title={t('premium.restore_button')}
              onPress={restorePurchases}
              variant="outline"
              style={styles.restoreButton}
            />
          </View>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <IconButton
            icon="arrow-back"
            onPress={() => router.back()}
            backgroundColor="transparent"
          />
        </View>

        <View style={styles.heroSection}>
          <HaloGlow size={180} intensity="high" />
          <Text style={styles.title}>Noor Halo Plus</Text>
          <Text style={styles.subtitle}>{t('premium.subtitle')}</Text>
        </View>

        <View style={styles.features}>
          {features.map((feature, index) => (
            <Card key={index} style={styles.featureCard}>
              <View style={styles.featureHeader}>
                <View style={styles.iconCircle}>
                  <Ionicons name={feature.icon} size={24} color={colors.pinkHalo} />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{t(feature.titleKey)}</Text>
                  <Text style={styles.featureDescription}>{t(feature.descriptionKey)}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        <View style={styles.pricing}>
          <Card style={styles.priceCard} glow>
            <View style={styles.priceHeader}>
              <Text style={styles.priceTitle}>{t('premium.yearly_plan')}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{t('premium.best_value')}</Text>
              </View>
            </View>
            <Text style={styles.priceAmount}>{t('premium.yearly_price')}</Text>
            <Text style={styles.priceDescription}>{t('premium.yearly_desc')}</Text>
            <Button
              title={t('premium.start_yearly')}
              onPress={purchaseYearly}
              style={styles.purchaseButton}
            />
          </Card>

          <Card style={styles.priceCard}>
            <Text style={styles.priceTitle}>{t('premium.monthly_plan')}</Text>
            <Text style={styles.priceAmount}>{t('premium.monthly_price')}</Text>
            <Text style={styles.priceDescription}>{t('premium.monthly_desc')}</Text>
            <Button
              title={t('premium.start_monthly')}
              onPress={purchaseMonthly}
              variant="outline"
              style={styles.purchaseButton}
            />
          </Card>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={restorePurchases}>
            <Text style={styles.restoreText}>{t('premium.restore_button')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.laterText}>{t('premium.maybe_later')}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.title1,
    color: colors.white,
    marginTop: spacing.lg,
  },
  subtitle: {
    ...typography.body1,
    color: colors.lightGray,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  features: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  featureCard: {
    marginBottom: spacing.md,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.pinkHalo,
  },
  featureText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  featureTitle: {
    ...typography.title3,
    color: colors.white,
    marginBottom: 4,
  },
  featureDescription: {
    ...typography.body2,
    color: colors.lightGray,
  },
  pricing: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  priceCard: {
    marginBottom: spacing.md,
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  priceTitle: {
    ...typography.title3,
    color: colors.white,
  },
  badge: {
    backgroundColor: colors.pinkHalo,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '600',
  },
  priceAmount: {
    ...typography.title2,
    color: colors.pinkHalo,
    marginBottom: spacing.xs,
  },
  priceDescription: {
    ...typography.caption,
    color: colors.mediumGray,
    marginBottom: spacing.md,
  },
  purchaseButton: {
    marginTop: spacing.sm,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  restoreText: {
    ...typography.body2,
    color: colors.softPurpleGlow,
    marginBottom: spacing.md,
  },
  laterText: {
    ...typography.body2,
    color: colors.mediumGray,
  },
  premiumActive: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  checkIcon: {
    position: 'absolute',
  },
  activeTitle: {
    ...typography.title2,
    color: colors.white,
    marginTop: spacing.xxl,
    marginBottom: spacing.sm,
  },
  activeSubtitle: {
    ...typography.body1,
    color: colors.lightGray,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  restoreButton: {
    width: '100%',
  },
});

export default NoorHaloPlusScreen;
