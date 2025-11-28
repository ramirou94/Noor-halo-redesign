import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { I18nManager } from 'react-native';

import en from './en.json';
import fr from './fr.json';
import ar from './ar.json';

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  ar: { translation: ar },
};

// Get device language
const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: deviceLanguage,
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false,
    },
  });

// Handle RTL for Arabic
if (deviceLanguage === 'ar') {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
} else {
  I18nManager.allowRTL(false);
  I18nManager.forceRTL(false);
}

export default i18n;