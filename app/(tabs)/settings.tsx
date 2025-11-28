import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { CelestialOrb } from '../../components/CelestialOrb';
import Button from '../../components/Button';
import { colors, spacing, typography, borderRadius } from '../../styles/theme';
import { storage, StorageKeys } from '../../utils/storage';
import { UserPreferences } from '../../utils/types';
import { useAuth } from '../../contexts/AuthContext';
import { usePremium } from '../../contexts/PremiumContext';
import { initializeNotifications } from '../../utils/notifications';

const { width } = Dimensions.get('window');

const SettingsScreen = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { isPremium, restorePurchases } = usePremium();
  const [preferences, setPreferences] = useState<UserPreferences>({
    language: 'en',
    theme: 'dark',
    notifications: {
      enabled: true,
      morningReminder: true,
      eveningReminder: true,
      dailyQuote: true,
      habits: true,
    },
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  useEffect(() => {
    if (preferences) {
      initializeNotifications(preferences);
    }
  }, [preferences.notifications]);

  const loadPreferences = async () => {
    const saved = await storage.getItem<UserPreferences>(StorageKeys.PREFERENCES);
    if (saved) {
      setPreferences(saved);
    }
  };

  const savePreferences = async (updated: UserPreferences) => {
    await storage.setItem(StorageKeys.PREFERENCES, updated);
    setPreferences(updated);
  };

  const changeLanguage = (lang: 'en' | 'fr' | 'ar') => {
    i18n.changeLanguage(lang);
    const updated = { ...preferences, language: lang };
    savePreferences(updated);
  };

  const toggleNotification = (key: keyof UserPreferences['notifications']) => {
    const updated = {
      ...preferences,
      notifications: {
        ...preferences.notifications,
        [key]: !preferences.notifications[key],
      },
    };
    savePreferences(updated);
  };

  const handleSignOut = async () => {
    Alert.alert(
      t('settings.log_out'),
      'Are you sure you want to sign out?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('settings.log_out'),
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              Alert.alert(t('common.success'), 'Signed out successfully');
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const resetHabits = () => {
    Alert.alert(
      t('settings.reset_habits'),
      t('settings.reset_confirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            await storage.removeItem(StorageKeys.HABITS);
            Alert.alert(t('common.success'), 'Habits have been reset');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={styles.backgroundContainer}>
        <View style={styles.orbTop}>
          <CelestialOrb size={width * 1.3} variant="moonlight" />
        </View>
        <View style={styles.orbBottom}>
          <CelestialOrb size={width * 0.7} variant="starfield" />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{t('settings.title')}</Text>

        {/* Account Section */}
        <BlurView intensity={10} tint="dark" style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{t('settings.account')}</Text>

            {!user ? (
              <>
                <Text style={styles.infoText}>{t('settings.sync_backup')}</Text>
                <Button
                  title={t('settings.create_account')}
                  onPress={() => router.push('/auth/login')}
                  style={styles.actionButton}
                />
              </>
            ) : (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.settingLabel}>{t('settings.logged_in_as')}</Text>
                </View>
                <Text style={styles.emailText}>{user.email}</Text>
                <Button
                  title={t('settings.log_out')}
                  onPress={handleSignOut}
                  variant="outline"
                  style={styles.actionButton}
                />
              </>
            )}
          </View>
        </BlurView>

        {/* Noor Halo Plus Section */}
        <BlurView intensity={10} tint="dark" style={[styles.card, !isPremium && styles.premiumCard]}>
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{t('settings.noor_halo_plus')}</Text>
              {isPremium && (
                <View style={styles.premiumBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.midnight} />
                  <Text style={styles.premiumBadgeText}>Active</Text>
                </View>
              )}
            </View>

            {!isPremium ? (
              <>
                <Text style={styles.infoText}>
                  Unlock all challenges, all audios, and deeper practices
                </Text>
                <Button
                  title={t('settings.discover_plus')}
                  onPress={() => router.push('/noor-halo-plus')}
                  style={styles.actionButton}
                />
              </>
            ) : (
              <Text style={styles.premiumActiveText}>{t('settings.plus_active')}</Text>
            )}

            <TouchableOpacity
              style={styles.restoreButton}
              onPress={restorePurchases}
            >
              <Text style={styles.restoreText}>{t('premium.restore_button')}</Text>
            </TouchableOpacity>
          </View>
        </BlurView>

        {/* Language */}
        <BlurView intensity={10} tint="dark" style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{t('settings.language')}</Text>
            <View style={styles.optionsContainer}>
              {(['en', 'fr', 'ar'] as const).map((lang) => (
                <TouchableOpacity
                  key={lang}
                  style={[
                    styles.optionButton,
                    preferences.language === lang && styles.optionButtonActive,
                  ]}
                  onPress={() => changeLanguage(lang)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      preferences.language === lang && styles.optionTextActive,
                    ]}
                  >
                    {lang.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </BlurView>

        {/* Theme */}
        <BlurView intensity={10} tint="dark" style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{t('settings.theme')}</Text>
            <View style={styles.optionsContainer}>
              {(['light', 'dark'] as const).map((theme) => (
                <TouchableOpacity
                  key={theme}
                  style={[
                    styles.optionButton,
                    preferences.theme === theme && styles.optionButtonActive,
                  ]}
                  onPress={() => savePreferences({ ...preferences, theme })}
                >
                  <Text
                    style={[
                      styles.optionText,
                      preferences.theme === theme && styles.optionTextActive,
                    ]}
                  >
                    {t(`settings.${theme}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </BlurView>

        {/* Notifications */}
        <BlurView intensity={10} tint="dark" style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{t('settings.notifications')}</Text>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>{t('settings.morning_reminder')}</Text>
              <Switch
                value={preferences.notifications.morningReminder}
                onValueChange={() => toggleNotification('morningReminder')}
                trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: colors.auroraTeal }}
                thumbColor={preferences.notifications.morningReminder ? colors.moonstone : colors.stardust}
                ios_backgroundColor="rgba(255, 255, 255, 0.1)"
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>{t('settings.evening_reminder')}</Text>
              <Switch
                value={preferences.notifications.eveningReminder}
                onValueChange={() => toggleNotification('eveningReminder')}
                trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: colors.auroraTeal }}
                thumbColor={preferences.notifications.eveningReminder ? colors.moonstone : colors.stardust}
                ios_backgroundColor="rgba(255, 255, 255, 0.1)"
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>{t('settings.daily_quote')}</Text>
              <Switch
                value={preferences.notifications.dailyQuote}
                onValueChange={() => toggleNotification('dailyQuote')}
                trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: colors.auroraTeal }}
                thumbColor={preferences.notifications.dailyQuote ? colors.moonstone : colors.stardust}
                ios_backgroundColor="rgba(255, 255, 255, 0.1)"
              />
            </View>
          </View>
        </BlurView>

        {/* Actions */}
        <BlurView intensity={10} tint="dark" style={styles.card}>
          <View style={styles.cardContent}>
            <TouchableOpacity style={styles.actionRow} onPress={resetHabits}>
              <Ionicons name="refresh" size={24} color={colors.error} />
              <Text style={[styles.settingLabel, { color: colors.error }]}>
                {t('settings.reset_habits')}
              </Text>
            </TouchableOpacity>
          </View>
        </BlurView>

        {/* Legal Section */}
        <BlurView intensity={10} tint="dark" style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Légal</Text>

            <TouchableOpacity
              style={styles.infoRow}
              onPress={() => router.push('/legal/mentions-legales')}
            >
              <Text style={styles.settingLabel}>Mentions légales</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.stardust} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.infoRow}
              onPress={() => router.push('/legal/cgu')}
            >
              <Text style={styles.settingLabel}>Conditions d'utilisation</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.stardust} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.infoRow}
              onPress={() => router.push('/legal/politique-confidentialite')}
            >
              <Text style={styles.settingLabel}>Politique de confidentialité</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.stardust} />
            </TouchableOpacity>
          </View>
        </BlurView>

        {/* Info */}
        <BlurView intensity={10} tint="dark" style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.infoRow}>
              <Text style={styles.settingLabel}>{t('settings.version')}</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>

            <TouchableOpacity style={styles.infoRow}>
              <Text style={styles.settingLabel}>{t('settings.credits')}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.stardust} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.infoRow}>
              <Text style={styles.settingLabel}>{t('settings.privacy')}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.stardust} />
            </TouchableOpacity>
          </View>
        </BlurView>

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
    top: -150,
    right: -50,
    opacity: 0.5,
  },
  orbBottom: {
    position: 'absolute',
    bottom: -100,
    left: -100,
    opacity: 0.4,
  },
  content: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  title: {
    ...typography.title2,
    color: colors.moonstone,
    marginBottom: spacing.lg,
  },
  card: {
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  premiumCard: {
    borderColor: 'rgba(241, 188, 94, 0.3)',
  },
  cardContent: {
    padding: spacing.md,
    backgroundColor: 'rgba(10, 14, 39, 0.3)',
  },
  cardTitle: {
    ...typography.title3,
    color: colors.moonstone,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cosmicGold,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  premiumBadgeText: {
    ...typography.caption,
    color: colors.midnight,
    fontWeight: '600',
  },
  infoText: {
    ...typography.body2,
    color: colors.stardust,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  emailText: {
    ...typography.body1,
    color: colors.auroraTeal,
    marginBottom: spacing.md,
  },
  premiumActiveText: {
    ...typography.body1,
    color: colors.cosmicGold,
  },
  restoreButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  restoreText: {
    ...typography.body2,
    color: colors.auroraViolet,
  },
  actionButton: {
    marginTop: spacing.sm,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  optionButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  optionButtonActive: {
    borderColor: colors.auroraTeal,
    backgroundColor: 'rgba(20, 241, 149, 0.1)',
  },
  optionText: {
    ...typography.button,
    color: colors.stardust,
  },
  optionTextActive: {
    color: colors.auroraTeal,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  settingLabel: {
    ...typography.body1,
    color: colors.moonstone,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  infoValue: {
    ...typography.body2,
    color: colors.stardust,
  },
});

export default SettingsScreen;
