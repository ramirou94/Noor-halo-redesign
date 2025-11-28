import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import GradientBackground from '../../components/GradientBackground';
import IconButton from '../../components/IconButton';
import { colors, spacing, typography } from '../../styles/theme';
import legalContent from '../../utils/legalContent';

const CGUScreen = () => {
  const router = useRouter();
  const { i18n } = useTranslation();
  
  const currentLang = i18n.language as 'en' | 'fr' | 'ar';
  const content = legalContent.cgu[currentLang] || legalContent.cgu.fr;

  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <IconButton
            icon="arrow-back"
            onPress={() => router.back()}
            backgroundColor="transparent"
          />
          <Text style={styles.headerTitle}>CGU</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>{content.title}</Text>
          <Text style={styles.lastUpdate}>Dernière mise à jour : {content.lastUpdate}</Text>

          {content.sections.map((section, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionContent}>{section.content}</Text>
            </View>
          ))}

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
  headerTitle: {
    ...typography.title3,
    color: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.title2,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  lastUpdate: {
    ...typography.caption,
    color: colors.mediumGray,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.title3,
    color: colors.softPurpleGlow,
    marginBottom: spacing.md,
  },
  sectionContent: {
    ...typography.body2,
    color: colors.lightGray,
    lineHeight: 24,
  },
});

export default CGUScreen;