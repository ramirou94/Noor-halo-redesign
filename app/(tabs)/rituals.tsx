import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
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
import { Ritual } from '../../utils/types';
import ritualsData from '../../data/rituals.json';

const { width } = Dimensions.get('window');

const RitualsScreen = () => {
  const { t, i18n } = useTranslation();
  const [myRituals, setMyRituals] = useState<number[]>([]);
  const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadMyRituals();
  }, []);

  const loadMyRituals = async () => {
    const saved = await storage.getItem<number[]>(StorageKeys.MY_RITUALS);
    if (saved) {
      setMyRituals(saved);
    }
  };

  const toggleRitual = async (ritualId: number) => {
    let updated: number[];
    if (myRituals.includes(ritualId)) {
      updated = myRituals.filter((id) => id !== ritualId);
    } else {
      updated = [...myRituals, ritualId];
    }
    await storage.setItem(StorageKeys.MY_RITUALS, updated);
    setMyRituals(updated);
  };

  const openRitualDetail = (ritual: Ritual) => {
    setSelectedRitual(ritual);
    setShowModal(true);
  };

  const isInMyRituals = (ritualId: number) => myRituals.includes(ritualId);

  const currentLanguage = i18n.language as 'en' | 'fr' | 'ar';

  const getRitualContent = (ritual: Ritual) => {
    return ritual[currentLanguage] || ritual.en;
  };

  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={styles.backgroundContainer}>
        <View style={styles.orbTop}>
          <CelestialOrb size={width * 1.2} variant="moonlight" />
        </View>
        <View style={styles.orbBottom}>
          <CelestialOrb size={width * 0.8} variant="starfield" />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{t('rituals.title')}</Text>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {(ritualsData as Ritual[]).map((ritual) => {
            const content = getRitualContent(ritual);
            const isActive = isInMyRituals(ritual.id);

            return (
              <TouchableOpacity
                key={ritual.id}
                onPress={() => openRitualDetail(ritual)}
                activeOpacity={0.9}
              >
                <BlurView intensity={10} tint="dark" style={styles.ritualCard}>
                  <View style={[styles.ritualCardContent, isActive && styles.ritualCardActive]}>
                    <View style={styles.ritualHeader}>
                      <View style={[styles.iconContainer, { backgroundColor: isActive ? 'rgba(20, 241, 149, 0.2)' : 'rgba(157, 78, 221, 0.2)' }]}>
                        <Ionicons
                          name="moon"
                          size={24}
                          color={isActive ? colors.auroraTeal : colors.auroraViolet}
                        />
                      </View>
                      <View style={styles.ritualInfo}>
                        <Text style={styles.ritualTitle}>{content.title}</Text>
                        <Text style={styles.ritualDuration}>{content.durationMinutes} min</Text>
                      </View>
                      {isActive && (
                        <Ionicons name="checkmark-circle" size={24} color={colors.auroraTeal} />
                      )}
                    </View>
                    <Text style={styles.ritualDescription} numberOfLines={2}>
                      {content.description}
                    </Text>
                  </View>
                </BlurView>
              </TouchableOpacity>
            );
          })}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Ritual Detail Modal */}
        <Modal
          visible={showModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalOverlay}>
            <BlurView intensity={80} tint="dark" style={styles.modalBlur}>
              <View style={styles.modalContent}>
                {selectedRitual && (() => {
                  const content = getRitualContent(selectedRitual);
                  return (
                    <>
                      <View style={styles.modalHeader}>
                        <View style={styles.modalIconContainer}>
                          <Ionicons
                            name="moon"
                            size={48}
                            color={colors.auroraTeal}
                          />
                        </View>
                        <IconButton
                          icon="close"
                          onPress={() => setShowModal(false)}
                          backgroundColor="transparent"
                          color={colors.moonstone}
                          style={styles.closeButton}
                        />
                      </View>

                      <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.modalTitle}>{content.title}</Text>
                        <Text style={styles.modalDuration}>{content.durationMinutes} {t('rituals.duration')}</Text>

                        <View style={styles.section}>
                          <Text style={styles.sectionLabel}>{t('rituals.intention')}</Text>
                          <Text style={styles.sectionText}>{content.intention}</Text>
                        </View>

                        <View style={styles.section}>
                          <Text style={styles.sectionLabel}>Description</Text>
                          <Text style={styles.sectionText}>{content.description}</Text>
                        </View>

                        <View style={styles.section}>
                          <Text style={styles.sectionLabel}>Steps</Text>
                          {content.steps.map((step, index) => (
                            <View key={index} style={styles.stepContainer}>
                              <Text style={styles.stepNumber}>{index + 1}.</Text>
                              <Text style={styles.stepText}>{step}</Text>
                            </View>
                          ))}
                        </View>
                      </ScrollView>

                      <Button
                        title={
                          isInMyRituals(selectedRitual.id)
                            ? t('rituals.remove_from_rituals')
                            : t('rituals.add_to_rituals')
                        }
                        onPress={() => {
                          toggleRitual(selectedRitual.id);
                          setShowModal(false);
                        }}
                        variant={isInMyRituals(selectedRitual.id) ? 'outline' : 'primary'}
                        style={styles.actionButton}
                      />
                    </>
                  );
                })()}
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
    top: -150,
    right: -100,
    opacity: 0.7,
  },
  orbBottom: {
    position: 'absolute',
    bottom: -100,
    left: -100,
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
  title: {
    ...typography.title2,
    color: colors.moonstone,
    marginBottom: spacing.lg,
  },
  ritualCard: {
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  ritualCardContent: {
    padding: spacing.md,
    backgroundColor: 'rgba(10, 14, 39, 0.3)',
  },
  ritualCardActive: {
    borderLeftWidth: 3,
    borderLeftColor: colors.auroraTeal,
  },
  ritualHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ritualInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  ritualTitle: {
    ...typography.title3,
    color: colors.moonstone,
    marginBottom: 4,
  },
  ritualDuration: {
    ...typography.caption,
    color: colors.stardust,
  },
  ritualDescription: {
    ...typography.body2,
    color: colors.stardust,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalBlur: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    maxHeight: '85%',
  },
  modalContent: {
    padding: spacing.lg,
    backgroundColor: 'rgba(10, 14, 39, 0.5)',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(20, 241, 149, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  modalTitle: {
    ...typography.title2,
    color: colors.moonstone,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  modalDuration: {
    ...typography.body1,
    color: colors.auroraTeal,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    ...typography.button,
    color: colors.auroraViolet,
    marginBottom: spacing.sm,
  },
  sectionText: {
    ...typography.body1,
    color: colors.stardust,
    lineHeight: 24,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    paddingLeft: spacing.sm,
  },
  stepNumber: {
    ...typography.button,
    color: colors.auroraTeal,
    marginRight: spacing.sm,
    minWidth: 24,
  },
  stepText: {
    ...typography.body2,
    color: colors.stardust,
    flex: 1,
    lineHeight: 22,
  },
  actionButton: {
    marginTop: spacing.md,
  },
});

export default RitualsScreen;
