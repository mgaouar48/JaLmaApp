import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Modal, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../../src/constants';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../../src/i18n';

const LANGUAGES = [
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
];

export default function ProfileScreen() {
    const { t, i18n } = useTranslation();
    const [langModalVisible, setLangModalVisible] = useState(false);

    const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

    const handleLanguageChange = async (langCode: string) => {
        if (langCode === i18n.language) {
            setLangModalVisible(false);
            return;
        }

        setLangModalVisible(false);
        const needsReload = await changeLanguage(langCode);
        if (needsReload) {
            Alert.alert(
                t('lang.title'),
                t('lang.changeLangRestart'),
            );
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('profile.title')}</Text>
            </View>
            <View style={styles.content}>
                <View style={styles.avatar}>
                    <MaterialIcons name="person" size={48} color={Colors.white} />
                </View>
                <Text style={styles.name}>Karim Benali</Text>
                <Text style={styles.email}>karim.benali@email.com</Text>

                <View style={styles.menuList}>
                    {[
                        { icon: 'edit' as const, label: t('profile.editProfile'), action: () => router.push('/edit-profile') },
                        { icon: 'notifications' as const, label: t('profile.notifications') },
                        { icon: 'language' as const, label: `${t('profile.language')} (${currentLang.flag} ${currentLang.label})`, action: () => setLangModalVisible(true) },
                        { icon: 'help-outline' as const, label: t('profile.helpSupport'), action: () => router.push('/help-support') },
                        { icon: 'info-outline' as const, label: t('profile.about'), action: () => router.push('/about') },
                    ].map((item, i) => (
                        <TouchableOpacity
                            key={i}
                            style={styles.menuItem}
                            onPress={item.action}
                        >
                            <View style={styles.menuIconBg}>
                                <MaterialIcons name={item.icon} size={20} color={Colors.primary} />
                            </View>
                            <Text style={styles.menuLabel}>{item.label}</Text>
                            <MaterialIcons name="chevron-right" size={20} color={Colors.slate400} />
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => router.replace('/login')}
                >
                    <MaterialIcons name="logout" size={20} color={Colors.statusRed} />
                    <Text style={styles.logoutText}>{t('profile.logout')}</Text>
                </TouchableOpacity>
            </View>

            {/* Language Picker Modal */}
            <Modal
                visible={langModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setLangModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setLangModalVisible(false)}
                >
                    <TouchableOpacity activeOpacity={1} onPress={() => { }}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{t('lang.title')}</Text>
                            {LANGUAGES.map((lang) => (
                                <TouchableOpacity
                                    key={lang.code}
                                    style={[
                                        styles.langOption,
                                        lang.code === i18n.language && styles.langOptionActive,
                                    ]}
                                    onPress={() => handleLanguageChange(lang.code)}
                                >
                                    <Text style={styles.langFlag}>{lang.flag}</Text>
                                    <Text style={[
                                        styles.langLabel,
                                        lang.code === i18n.language && styles.langLabelActive,
                                    ]}>
                                        {lang.label}
                                    </Text>
                                    {lang.code === i18n.language && (
                                        <MaterialIcons name="check-circle" size={20} color={Colors.primary} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundLight,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 56 : 48,
        paddingBottom: 16,
    },
    title: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        ...Shadows.float,
    },
    name: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        color: Colors.primary,
        marginBottom: 4,
    },
    email: {
        fontSize: FontSize.sm,
        color: Colors.slate500,
        marginBottom: 32,
    },
    menuList: {
        width: '100%',
        gap: 4,
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.lg,
        padding: 8,
        ...Shadows.soft,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 12,
        gap: 12,
    },
    menuIconBg: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: `${Colors.primary}10`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuLabel: {
        flex: 1,
        fontSize: FontSize.base,
        fontWeight: FontWeight.medium,
        color: Colors.slate800,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 32,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: BorderRadius.lg,
        backgroundColor: Colors.red50,
    },
    logoutText: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.semibold,
        color: Colors.statusRed,
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.xl,
        padding: 24,
        ...Shadows.float,
    },
    modalTitle: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
        textAlign: 'center',
        marginBottom: 20,
    },
    langOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: BorderRadius.lg,
        gap: 12,
        marginBottom: 8,
    },
    langOptionActive: {
        backgroundColor: `${Colors.primary}10`,
    },
    langFlag: {
        fontSize: 24,
    },
    langLabel: {
        flex: 1,
        fontSize: FontSize.lg,
        fontWeight: FontWeight.medium,
        color: Colors.slate700,
    },
    langLabelActive: {
        color: Colors.primary,
        fontWeight: FontWeight.bold,
    },
});
