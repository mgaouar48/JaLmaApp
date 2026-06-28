import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ar from './locales/ar';
import fr from './locales/fr';
import en from './locales/en';

const LANGUAGE_KEY = '@app_language';

// Initialize synchronously with Arabic as default.
// The saved language is applied later via loadSavedLanguage().
i18n
    .use(initReactI18next)
    .init({
        resources: {
            ar: { translation: ar },
            fr: { translation: fr },
            en: { translation: en },
        },
        lng: 'ar', // default language, sync — no async detector
        fallbackLng: 'ar',
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    });

/**
 * Load saved language from AsyncStorage and apply it.
 * Call this once at app startup (in _layout.tsx).
 * Returns the loaded language code.
 */
export async function loadSavedLanguage(): Promise<string> {
    try {
        const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (savedLang && savedLang !== i18n.language) {
            await i18n.changeLanguage(savedLang);
        }
        // Apply RTL setting
        const lang = savedLang || 'ar';
        const isRTL = lang === 'ar';
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(isRTL);
        return lang;
    } catch {
        return 'ar';
    }
}

/**
 * Change language, persist to storage, and handle RTL.
 * Returns true if an app reload is needed (RTL direction changed).
 */
export async function changeLanguage(lang: string): Promise<boolean> {
    const isRTL = lang === 'ar';
    const needsReload = I18nManager.isRTL !== isRTL;

    // Change language first so UI updates immediately
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);

    if (needsReload) {
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(isRTL);
    }

    return needsReload;
}

export default i18n;
