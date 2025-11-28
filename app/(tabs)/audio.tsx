import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { BlurView } from 'expo-blur';
import { CelestialOrb } from '../../components/CelestialOrb';
import IconButton from '../../components/IconButton';
import { colors, spacing, typography, borderRadius } from '../../styles/theme';
import { AudioTrack } from '../../utils/types';
import { usePremium } from '../../contexts/PremiumContext';
import audiosData from '../../data/audios.json';

const { width } = Dimensions.get('window');

const AudioScreen = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { isPremium } = usePremium();
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleTrackPress = (track: AudioTrack) => {
    if (track.isPremium && !isPremium) {
      router.push('/noor-halo-plus');
      return;
    }

    playTTS(track);
  };

  const playTTS = async (track: AudioTrack) => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      if (currentTrack?.id === track.id) {
        setCurrentTrack(null);
        return;
      }
    }

    setCurrentTrack(track);
    setIsSpeaking(true);

    const currentLanguage = i18n.language as 'en' | 'fr' | 'ar';
    const content = track[currentLanguage] || track.en;

    const text = `${content.title}. ${content.description}. Take a deep breath. Let go of any tension. Feel the calm wash over you. You are at peace.`;

    Speech.speak(text, {
      language: currentLanguage === 'ar' ? 'ar' : currentLanguage,
      pitch: 0.9,
      rate: 0.75,
      onDone: () => {
        setIsSpeaking(false);
        setCurrentTrack(null);
      },
      onStopped: () => {
        setIsSpeaking(false);
        setCurrentTrack(null);
      },
    });
  };

  const stopAudio = () => {
    Speech.stop();
    setIsSpeaking(false);
    setCurrentTrack(null);
  };

  const getTrackContent = (track: AudioTrack) => {
    const currentLanguage = i18n.language as 'en' | 'fr' | 'ar';
    return track[currentLanguage] || track.en;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${mins} min`;
  };

  const isLocked = (track: AudioTrack) => track.isPremium && !isPremium;

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={styles.backgroundContainer}>
        <View style={styles.orbCenter}>
          <CelestialOrb size={width * 1.5} variant="aurora" />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{t('audio.title')}</Text>

        {currentTrack && (
          <BlurView intensity={20} tint="dark" style={styles.playerCard}>
            <View style={styles.playerContent}>
              <View style={styles.playerHeader}>
                <View style={styles.glowContainer}>
                  <View style={[styles.glow, { opacity: isSpeaking ? 1 : 0.5 }]} />
                  <Ionicons
                    name="musical-notes"
                    size={48}
                    color={colors.auroraTeal}
                  />
                </View>
              </View>
              <Text style={styles.nowPlaying}>{t('audio.now_playing')}</Text>
              <Text style={styles.trackTitle}>{getTrackContent(currentTrack).title}</Text>
              <Text style={styles.trackDuration}>{formatDuration(currentTrack.durationSeconds)}</Text>

              <View style={styles.controls}>
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={() => (isSpeaking ? stopAudio() : playTTS(currentTrack))}
                >
                  <Ionicons
                    name={isSpeaking ? 'pause' : 'play'}
                    size={32}
                    color={colors.midnight}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        )}

        <Text style={styles.sectionTitle}>{t('audio.library')}</Text>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {(audiosData as AudioTrack[]).map((track) => {
            const content = getTrackContent(track);
            const locked = isLocked(track);
            const isActive = currentTrack?.id === track.id;

            return (
              <TouchableOpacity key={track.id} onPress={() => handleTrackPress(track)} activeOpacity={0.9}>
                <BlurView
                  intensity={10}
                  tint="dark"
                  style={[
                    styles.trackCard,
                    isActive && styles.trackCardActive,
                  ]}
                >
                  <View style={styles.trackCardContent}>
                    <View style={styles.trackInfo}>
                      <View style={[styles.trackIconContainer, { backgroundColor: locked ? 'rgba(74, 85, 104, 0.2)' : 'rgba(78, 168, 222, 0.2)' }]}>
                        <Ionicons
                          name={locked ? "lock-closed" : "musical-notes"}
                          size={20}
                          color={
                            locked ? colors.shadow :
                              isActive ? colors.auroraTeal : colors.stellarBlue
                          }
                        />
                      </View>
                      <View style={styles.trackDetails}>
                        <View style={styles.trackTitleRow}>
                          <Text style={styles.trackName}>{content.title}</Text>
                          {locked && (
                            <View style={styles.premiumBadge}>
                              <Text style={styles.premiumText}>{t('premium.locked')}</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.trackMeta}>{formatDuration(track.durationSeconds)}</Text>
                      </View>
                      {isActive && isSpeaking ? (
                        <ActivityIndicator color={colors.auroraTeal} />
                      ) : (
                        <Ionicons
                          name={isActive ? 'pause-circle' : 'play-circle'}
                          size={32}
                          color={locked ? colors.shadow : colors.auroraTeal}
                        />
                      )}
                    </View>
                  </View>
                </BlurView>
              </TouchableOpacity>
            );
          })}
          <View style={{ height: 100 }} />
        </ScrollView>
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
  orbCenter: {
    position: 'absolute',
    top: -200,
    left: -100,
    opacity: 0.6,
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
  playerCard: {
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(20, 241, 149, 0.3)',
  },
  playerContent: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    backgroundColor: 'rgba(10, 14, 39, 0.4)',
  },
  playerHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  glowContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.auroraTeal,
    opacity: 0.3,
    shadowColor: colors.auroraTeal,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
  },
  nowPlaying: {
    ...typography.caption,
    color: colors.stardust,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  trackTitle: {
    ...typography.title2,
    color: colors.moonstone,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  trackDuration: {
    ...typography.body2,
    color: colors.auroraTeal,
    marginBottom: spacing.lg,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.auroraTeal,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.auroraTeal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  sectionTitle: {
    ...typography.title3,
    color: colors.moonstone,
    marginBottom: spacing.md,
  },
  trackCard: {
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  trackCardActive: {
    borderColor: colors.auroraTeal,
    borderWidth: 2,
  },
  trackCardContent: {
    padding: spacing.md,
    backgroundColor: 'rgba(10, 14, 39, 0.3)',
  },
  trackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackDetails: {
    flex: 1,
    marginLeft: spacing.md,
  },
  trackTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  trackName: {
    ...typography.body1,
    color: colors.moonstone,
    flex: 1,
  },
  trackMeta: {
    ...typography.caption,
    color: colors.stardust,
  },
  premiumBadge: {
    backgroundColor: colors.cosmicGold,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: spacing.sm,
  },
  premiumText: {
    ...typography.caption,
    color: colors.midnight,
    fontSize: 10,
    fontWeight: '600',
  },
});

export default AudioScreen;
